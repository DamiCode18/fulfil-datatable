import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import axios from "axios";
import DataTable from "./components/DataTable";
import { useCallback } from "react";

function App() {
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(1000);
  const [loading, setLoading] = useState(true);
  const loader = useRef();
  const [currentVal, setCurrentVal] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    let cancel;
    axios({
      method: "GET",
      url: "https://jsonplaceholder.typicode.com/photos",
      params: { _limit: pageSize },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if(axios.isCancel(err)) return;
      })
    return () => cancel();
  }, [pageSize]);

  const lastEle = useCallback(node => {
    if(loading) return;
    if(loader.current) loader.current.disconnect();
    loader.current = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting && data.length < 5000) {
        setPageSize(prevState => prevState + 1000);
      }
  })
  if(node) loader.current.observe(node);
  }, [data, loading]);


  const handleFilter = (e) => {
    e.preventDefault();
    const val = e.target.value;
    setCurrentVal(val);
    // filter by title or url or thumbnailUrl
    const filteredDatas = data.filter((item) => {
      return (
        item.title.toLowerCase().includes(val.toLowerCase()) ||
        item.url.toLowerCase().includes(val.toLowerCase()) ||
        item.thumbnailUrl.toLowerCase().includes(val.toLowerCase())
      );
    });
    setFilteredData(filteredDatas);
  };
  const tableData = currentVal ? filteredData : data;
  return (
    <div className="App p-20">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p className="p-1 border-b-4 w-10 border-blue-700 text-center cursor-pointer">
            All
          </p>
          <hr className="p-2 border-gray-400 w-100" />

          <form onSubmit={(e) => e.preventDefault()} className="mt-2 mb-4">
            <label
              htmlFor="search"
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300"
            >
              Search
            </label>
            <div className="relative">
              <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              <input
                onChange={(e) => handleFilter(e)}
                value={currentVal}
                type="search"
                autoComplete="off"
                id="search"
                className="outline-none block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900"
                placeholder="Search..."
                required=""
              />
            </div>
          </form>
          <DataTable
            tableData={tableData}
            headerData={["", "ID", "Title", "Link", "Thumbnail"]}
          />
        </>
      )}
      {tableData.length === 0 && (
        <div className="text-center p-20 bold font-bold">No data found</div>
      )}
      {tableData.length !== 0 && <div className="loading" ref={lastEle} />}
    </div>
  );
}

export default App;
