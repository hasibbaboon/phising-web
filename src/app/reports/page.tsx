"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  GetProp,
  RadioChangeEvent,
  Table,
  TableColumnsType,
  TablePaginationConfig,
  TableProps,
  Radio,
  Button,
} from "antd";
import type { SorterResult } from "antd/es/table/interface";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { CheckOutlined } from "@ant-design/icons";
import moment from "moment";

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<any>["field"];
  sortOrder?: SorterResult<any>["order"];
  filters?: Parameters<GetProp<TableProps, "onChange">>[1];
}

export default function Reports() {
  const axiosAuth = useAxiosAuth();
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 20,
    },
  });
  const getUsers = async () => {
    setLoading(true);
    const params = {
      page: tableParams.pagination?.current,
      isPhishing: filter === "all" ? "" : filter,
      ordering:
        tableParams?.sortField &&
        (tableParams?.sortOrder === "ascend"
          ? "-"
          : "" + tableParams?.sortField),
    };
    const url = `/api/reports?${new URLSearchParams(params).toString()}`;
    const res = await axiosAuth.get(url);
    if (res && res?.data) {
      setUsers(res?.data?.results);
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: res?.data?.count,
          // 200 is mock data, you should read it from server
          // total: data.totalCount,
        },
      });
    }
    setLoading(false);
  };
  const exportPdf = async () => {
    setLoading(true);
    const url = `/api/scan`;
    const res = await axiosAuth.post(url);
    if (res && res?.data) {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "file.csv"); //or any other extension
      document.body.appendChild(link);
      link.click();
    }
    setLoading(false);
  };
  const markAsSafe = async (id) => {
    setLoading(true);
    const url = `/api/mark-safe`;
    const res = await axiosAuth.post(url, { id: id });
    if (res) {
      getUsers();
    }
    setLoading(false);
  };
  const markAsSpam = async (id) => {
    setLoading(true);
    const url = `/api/mark-spam`;
    const res = await axiosAuth.post(url, { id: id });
    if (res) {
      getUsers();
    }
    setLoading(false);
  };
  useEffect(() => {
    getUsers();
  }, [
    filter,
    tableParams.pagination?.current,
    tableParams?.sortOrder,
    tableParams?.sortField,
  ]);

  const columns: TableColumnsType<any> = [
    {
      title: "Email Id",
      dataIndex: "email_id",
      className: "max-w-[200px]",
      sorter: true,
    },
    {
      title: "Subject",
      dataIndex: "subject",
      className: "max-w-[400px]",
    },
    {
      title: "Message",
      dataIndex: "message",
      className: "max-w-[400px]",
    },
    {
      title: "Flagged",
      dataIndex: "isPhishing",
      sorter: true,
      render: (value, record, index) => (
        <div>
          {record.isPhishing ? "Phishing" : "Safe"}
          {record?.reportAsSafe && <div>(Reported As Safe)</div>}
          {record?.isSpammed && <div>(Reported As Spam)</div>}
        </div>
      ),
    },
    {
      title: "Severity",
      dataIndex: "probability",
      sorter: true,
      render: (value, record, index) => (
        <div>
          {!record.isPhishing ? "No" : record.probability}

          {record.isPhishing && (
            <span className={"text-error-500"}>
              (
              {record.probability <= 60
                ? "Low"
                : record.probability <= 70
                  ? "Medium"
                  : record.probability <= 80
                    ? "High"
                    : "Critical"}
              )
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      sorter: true,
      render: (value, record, index) => (
        <div>{moment(record.created_at).format("YYYY-MM-DD hh:mm A")}</div>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (value, record, index) => (
        <div className={"flex gap-3 items-center"}>
          {record?.isPhishing
            ? !record?.reportAsSafe && (
                <Button
                  color={"primary"}
                  variant={"solid"}
                  className={
                    "px-3 h-[34px] font-bold rounded-[8px] border border-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  }
                  onClick={() => {
                    if (window.confirm("Are you sure to change this record?")) {
                      markAsSafe(record.id).then(() => {
                        getUsers();
                      });
                    }
                  }}
                >
                  Mark As Safe
                </Button>
              )
            : !record?.isSpammed && (
                <Button
                  color={"danger"}
                  variant={"solid"}
                  className={
                    "px-3 h-[34px] font-bold rounded-[8px] border border-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  }
                  onClick={() => {
                    if (window.confirm("Are you sure to change this record?")) {
                      markAsSpam(record.id).then(() => {
                        getUsers();
                      });
                    }
                  }}
                >
                  Mark As Spam
                </Button>
              )}
        </div>
      ),
    },
  ];
  const [searchText, setSearchText] = useState(search ? search : "");
  const handelFormSubmit = (e: any) => {
    e.preventDefault();
    setSearch(searchText);
    setTableParams({
      ...tableParams,
      pagination: {
        current: 1,
      },
    });
  };
  const handleTableChange: TableProps<any>["onChange"] = (
    pagination,
    filters,
    sorter,
  ) => {
    setTableParams({
      pagination,
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field,
    });

    // // `dataSource` is useless since `pageSize` changed
    // if (pagination.pageSize !== tableParams.pagination?.pageSize) {
    //   setData([]);
    // }
  };
  const onChange = (e: RadioChangeEvent) => {
    setFilter(e.target.value);
  };
  return (
    <div>
      <div className={"flex flex-wrap items-center gap-3 justify-between"}>
        <h6 className={"mb-4 mt-2 text-primary text-[18px]"}>Report List</h6>
        <div>
          <Radio.Group onChange={onChange} defaultValue="all">
            <Radio.Button value="all">All</Radio.Button>
            <Radio.Button value={"true"}>Flagged</Radio.Button>
            <Radio.Button value={"false"}>Safe</Radio.Button>
          </Radio.Group>
          <Button
            className={"ml-2"}
            loading={loading}
            onClick={() => {
              exportPdf();
            }}
          >
            Export As CSV
          </Button>
        </div>

        {/*<form className={"flex items-center mb-2"} onSubmit={handelFormSubmit}>*/}
        {/*  <div className="flex">*/}
        {/*    <input*/}
        {/*      className={"h-[32px] px-3 text-[black]"}*/}
        {/*      type="text"*/}
        {/*      placeholder={"Search"}*/}
        {/*      onChange={({ target }) => setSearchText(target.value)}*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*  <button*/}
        {/*    className={"h-[32px] bg-primary px-3 text-[black]"}*/}
        {/*    type="submit"*/}
        {/*  >*/}
        {/*    <SearchOutlined />*/}
        {/*  </button>*/}
        {/*</form>*/}
      </div>

      <Table
        // rowSelection={{
        //     ...rowSelection,
        // }}
        loading={loading}
        bordered
        scroll={{ x: true }}
        columns={columns}
        dataSource={users}
        rowKey={(record) => record.id}
        pagination={tableParams.pagination}
        onChange={handleTableChange}
      />
    </div>
  );
}
