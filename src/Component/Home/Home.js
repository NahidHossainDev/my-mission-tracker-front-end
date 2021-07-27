import React, { useEffect, useState } from "react";
import ModalForTodo from "./ModalForTodo";
import { Alert } from "react-bootstrap";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";

const Home = () => {
  const [dayRemaining, setDayRemaining] = useState(0);
  const [dayPassed, setDayPassed] = useState(0);
  const [hours, setHours] = useState(0);
  const [minute, setMinute] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [modalShow, setModalShow] = React.useState(false);
  const [todoData, setTodoData] = useState([]);
  const [worksDone, setWorksDone] = useState([]);
  const [toEdit, setToEdit] = useState();
  const [switchElement, setSwitchElement] = useState(null);

  const alrt = ["primary", "success", "danger", "warning", "info", "secondary"];

  const changeSwitchHandler = () => {
      if (switchElement === null) { setSwitchElement(false); }
      if (switchElement) { setSwitchElement(false); }
      if (switchElement === false) { setSwitchElement(true); }
  }
  
  // Set the date we're counting down to
  const startDateTime = new Date("May 06, 2021").getTime();
  const missionDate = new Date("July 30, 2021");

  useEffect(() => {
    // const interval = setInterval(() => {
    const now = new Date().getTime();
    const missionTime = missionDate.getTime();
    const distance = missionTime - now;
    // Time calculations for days, hours, minutes and seconds
    setDayRemaining(Math.floor(distance / (1000 * 60 * 60 * 24)));
    setHours(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    setMinute(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
    setSeconds(Math.floor((distance % (1000 * 60)) / 1000));
    // Calculate Passed day
    setDayPassed(Math.floor((now - startDateTime) / (1000 * 60 * 60 * 24)));
    // }, 6000);
    // return () => clearInterval(interval);
  }, []);

  useEffect(() => {
     fetchTodoList();
     fetchWorksDoneList();
  },[])

  const fetchTodoList = () => {
    fetch("https://stormy-crag-99956.herokuapp.com/getTodoList")
      .then((res) => res.json())
      .then((d) => setTodoData(d));
  };

  const fetchWorksDoneList = () => {
    fetch("https://stormy-crag-99956.herokuapp.com/getWorksDoneList")
      .then((res) => res.json())
      .then((d) => setWorksDone(d.reverse()));
  };
  const dataToEdit = (id) => {
    setToEdit(...todoData.filter((d) => d._id === id));
    setTodoData(todoData.filter((d) => d._id !== id));
    setModalShow(true);
  };

  const handlerForCreateToDo = (data) => {
    const todoObj = {
      date: data.date,
      todoArr: data,
      value: "",
    };
    // console.log(data);
    fetch("https://stormy-crag-99956.herokuapp.com/addNewTodo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todoObj),
    }).then((d) => d.status === 200 && fetchTodoList());
  };

  const update = (data, checkboxUpdate, id2, e) => {
    if (checkboxUpdate) {
      const checkData = data.todoArr.find((d) => d.id === id2);
      checkData.value = e.target.value;
    }
    fetch(`https://stormy-crag-99956.herokuapp.com/updateTodo/${data._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((d) => d.status === 200 && fetchTodoList());
    setToEdit(null);
  };

  const taskCompleted = (data) => {
    fetch("https://stormy-crag-99956.herokuapp.com/addToWorksDone", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((d) => d.status === 200 && fetchWorksDoneList());

    fetch(`https://stormy-crag-99956.herokuapp.com/delete/${data._id}`, {
      method: "DELETE",
    }).then((d) => d.status === 200 && fetchTodoList());
  };

  return (
    <div className="container">
      <h2 className="text-center">IELTS</h2>
      <div className="d-flex justify-content-between">
        <h5 className="text-center my-2">Started: May 06, 2021</h5>
        <h4 className="text-center clr-red my-0 hide-for-mobile ">
          Day Passed: {dayPassed} {dayPassed > 1 ? "days" : "day"}
        </h4>
        <h5 className="text-center my-2">Will be finish: July 30, 2021</h5>
      </div>
      <h4 className="text-center clr-red my-0 hide show-for-mobile">
        Day Passed: {dayPassed} {dayPassed > 1 ? "days" : "day"}
      </h4>
      <h3 className="text-center clr-green my-2">
        Remaining: {dayRemaining} {dayRemaining > 1 ? "days" : "day"}; {hours}{" "}
        {hours > 1 ? "hours" : "hour"}; {minute}{" "}
        {minute > 1 ? "minutes" : "minute"}; {seconds}{" "}
        {seconds > 1 ? "seconds" : "second"}
      </h3>
      <p className="my-3 mx-2">
        "Get out to bed early in the morning.{" "}
        <strong>Self Discipline is the fuel to success.</strong> If you can't
        become a <b>HARD WORKER</b> forget about your dream. There is no{" "}
        <b>SUBSTITUTE of HARD WORK</b>. No <b>SUBSTITUTE of DISCIPLINE"</b>.{" "}
      </p>
      <ModalForTodo
        show={modalShow}
        dataToEdit={toEdit}
        handler={handlerForCreateToDo}
        todoData={todoData}
        worksDoneData={worksDone}
        updateData={update}
        onHide={() => setModalShow(false)}
      />
      <b className="show-btn show-for-mobile" onClick={changeSwitchHandler}>
        Show {switchElement ? "Works Done" : "Todo List"}
      </b>
      <section className="my-5">
        <div className="row">
          {switchElement !== false && (
            <div className="col-md-6">
              <div className="border rounded">
                <h4
                  className="d-flex justify-content-around p-1 rounded"
                  style={{ backgroundColor: "#cd84f1" }}
                >
                  To Do
                  <button
                    className="btn btn-info py-0"
                    onClick={() => setModalShow(true)}
                  >
                    Create new To do
                  </button>
                </h4>
                {todoData.map((d1, i) => (
                  <Alert variant={alrt[i]} key={d1.id} className="m-2 alert">
                    <h6 className="text-center">{d1.date}</h6>
                    {d1.todoArr.map((d2, i) => (
                      <div
                        key={i}
                        className="mb-1 d-flex align-items-center parent"
                      >
                        <input
                          type="checkbox"
                          name={d2}
                          id={d2.id}
                          className="mr-2"
                          checked={d2.value === "on"}
                          onChange={(e) => update(d1, true, d2.id, e)}
                        />
                        <label htmlFor={d2.id}>{d2.label}</label>
                      </div>
                    ))}
                    <div className="d-flex">
                      <button
                        className="btn btn-secondary py-0 ml-auto mx-3"
                        onClick={() => dataToEdit(d1._id)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-info py-0 "
                        onClick={() => taskCompleted(d1)}
                      >
                        Done
                      </button>
                    </div>
                  </Alert>
                ))}
              </div>
            </div>
          )}

          {switchElement !== true && (
            <div className="col-md-6 ">
              <div className="border rounded">
                <h4
                  className="text-center p-1 rounded bg-success text-light"
                >
                  Works Done !!
                </h4>
                {worksDone.map((d, i) => (
                  <Alert variant="success" key={d.id} className="m-2 alert">
                    <h6 className="text-center">{d.date}</h6>
                    {d.todoArr.map((d, i) => (
                      <div className="mb-1 d-flex align-items-center parent">
                        {d.value === "on" ? (
                          <CheckCircleIcon
                            style={{
                              color: "green",
                              fontSize: "20px",
                              marginRight: "10px",
                            }}
                          />
                        ) : (
                          <CancelIcon
                            style={{
                              color: "red",
                              fontSize: "20px",
                              marginRight: "10px",
                            }}
                          />
                        )}
                        <label htmlFor={d.id}>{d.label}</label>
                      </div>
                    ))}
                  </Alert>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
