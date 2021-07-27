import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import DateFnsUtils from "@date-io/date-fns"
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
const ModalForTodo = (props) => {
  const [todoArray, setTodoArray] = useState([]);
  const [inputValue, setInputValue] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [idOfEditTodoData, setIdOfEditTodoData] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  }
  useEffect(() => {
    if (props.dataToEdit) {
      setTodoArray(props.dataToEdit.todoArr);
      setSelectedDate(props.dataToEdit.date);
    }
  }, [props.show]);

  const getInputData = () => {

    if (idOfEditTodoData) {
      todoArray.splice(idOfEditTodoData, 1, inputValue);
      setIdOfEditTodoData(null);
    } else {
      setTodoArray([...todoArray, inputValue]);
    }
    document.getElementById("input-box").value = "";
    
  };

  const handleForEnterKey = (e) => {

    const data = {
      label: e.target.value,
      id: `${e.target.value}${Math.random()}`,
    };

    if (idOfEditTodoData) {
      todoArray.splice(idOfEditTodoData, 1, data);
      setIdOfEditTodoData(null);
    } else {
      setTodoArray([...todoArray, data]);
    }
     document.getElementById("input-box").value = "";
  }
  
  const deleteTodo = (id) => {
    setTodoArray(todoArray.filter((d) => d.id !== id));
  };

  const save = (data) => {
    if (props.dataToEdit) {
      let det = selectedDate;
      // console.log(typeof (selectedDate));
      if (typeof(selectedDate) === "object") {
        det = selectedDate.toDateString();
      }
      const upData ={_id:props.dataToEdit._id, date:det, todoArr:data}
       props.updateData(upData);
    }
    else{
      data.date = selectedDate.toDateString()
      props.handler(data);
    }
    setTodoArray([]);
    props.onHide();
  };

  const copyFromPreviousData = (cate, date) => {
    let data;
    cate ? data = props.todoData.find((d) => d.date === date)
     : data = props.worksDoneData.find((d) => d.date === date);
    
    // Change Checkbox value:
     data.todoArr.forEach(element => element.value= "" )
     setTodoArray(data.todoArr);
  };

  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <h5 className="mr-3">Add Your Todo for : </h5>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            id="date-picker-inline"
            label="Date picker inline"
            value={selectedDate}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
        </MuiPickersUtilsProvider>
      </Modal.Header>
      <Modal.Body>
        <div className="input-group mb-3">
          <input
            type="text"
            id="input-box"
            className="form-control outline-none"
            placeholder="Type your Todo..."
            onBlur={(e) =>
              setInputValue({
                label: e.target.value,
                value: " ",
                id: `${e.target.value}${Math.random()}`,
              })
            }
            onKeyPress={(e) => e.code === "Enter" && handleForEnterKey(e)}
          />
          <div className="input-group-append">
            <span
              className="input-group-text bg-info text-light"
              id="basic-addon2"
              onClick={getInputData}
            >
              Add
            </span>
          </div>
        </div>
        <div className="d-flex justify-content-between">
          <select
            className="rounded"
            onChange={(e) => copyFromPreviousData(true, e.target.value)}
          >
            <option>Copy from Todo</option>
            {props.todoData.map((d, i) => (
              <option value={d.date}>{d.date}</option>
            ))}
          </select>
          <select
            className="rounded"
            onChange={(e) => copyFromPreviousData(false, e.target.value)}
          >
            <option>Copy from Works Done</option>
            {props.worksDoneData.map((d, i) => (
              <option value={d.date}>{d.date}</option>
            ))}
          </select>
        </div>
        {todoArray.map((d, i) => (
          <div key={i} className="mb-1 d-flex align-items-center parent">
            <input
              type="checkbox"
              name={d}
              id=""
              className="mr-2"
              checked={d.value === "on"}
            />
            <label htmlFor={d.id}>{d.label}</label>
            <button className="btn py-0 px-1 "
              onClick={() => {
               setIdOfEditTodoData(i);
               document.getElementById("input-box").value = todoArray[i].label;
              }}
            >
              <EditIcon style={{ fontSize: "1.2rem", color: "orange" }} />
            </button>
            <button
              className="btn py-0 px-1 text-danger"
              onClick={() => deleteTodo(d.id)}
            >
              <DeleteForeverIcon style={{ fontSize: "1.2rem" }} />
            </button>
          </div>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <button onClick={props.onHide} className="btn btn-danger py-1 px-3">
          Cancel
        </button>
        <button
          onClick={() => save(todoArray)}
          className="btn btn-info py-1 px-3"
        >
          Save
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalForTodo;