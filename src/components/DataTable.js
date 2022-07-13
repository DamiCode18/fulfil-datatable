import React, { Fragment, useRef, useState } from "react";

const Table = (props) => {
  const { tableData, headerData } = props;
  const [checked, setChecked] = useState(false)
     //toggle checkbox
     const rowCheckbox = useRef('')
     const toggleCheckboxes = () => {
         setChecked(prevState => !prevState)
     }

  const tableHeader = () => {
    return headerData.map((data, idx) => {
      return (
        <Fragment key={idx}>
          {data === "" && (
            <th className="border-2 border-slate-600 p-4">
              <input id='header-checkbox' type='checkbox' onChange={toggleCheckboxes} />
            </th>
          )}
          {data !== "" && (
            <th className="border-2 border-slate-600 p-4" key={idx}>
              {data}
            </th>
          )}
        </Fragment>
      );
    });
  };

  const returnTableData = () => {
    return tableData.map((todos, idx) => {
      const { id, title, url, thumbnailUrl } = todos;
      return (
        <tr data-id={id} key={id}>
          <td className="border-2 border-slate-600 p-4 text-center">
            <input type='checkbox' ref={rowCheckbox} checked={checked} readOnly />
          </td>
          <td className="border-2 border-slate-600 p-4 text-center">{id}</td>
          <td className="border-2 border-slate-600 p-4 text-center">{title}</td>
          <td className="border-2 border-slate-600 p-4 text-center">{url}</td>
          <td className="border-2 border-slate-600 p-4 text-center">
            {thumbnailUrl}
          </td>
        </tr>
      );
    });
  };

  return (
    <>
      <table className="border-collapse border border-slate-500 w-100 table-fixed">
        <thead>
          <tr>{tableHeader()}</tr>
        </thead>
        <tbody>{returnTableData()}</tbody>
      </table>
    </>
  );
};

export default Table;
