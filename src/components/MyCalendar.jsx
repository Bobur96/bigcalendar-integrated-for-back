import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useState } from "react";
import MyModal from "./MyModal";

//dnd calendar
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { toast } from "react-toastify";
import axios from "axios";
import { useEffect } from "react";
const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

// react BigCalendar component
const BigCalendar = () => {
  const [events, setEvents] = useState([]);

  //states for creating event
  const [modalStatus, setModalStatus] = useState(false);
  const [eventInput, setEventInput] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  //state for on select event
  const [eventId, setEventId] = useState("");
  const [editStatus, setEditStatus] = useState(false);

  const handleClose = () => {
    setModalStatus(false);
    setEventInput("");
  };

  const handleChange = (e) => {
    setEventInput(e.target.value);
  };

  const handleSave = async () => {
    if (eventInput){
      const body = {
        title: `${eventInput}`,
        start: new Date(`${startDate}`),
        end: new Date(`${endDate}`),
      }

      await axios.post(`${process.env.REACT_APP_URL}/calendar`, body,
        { headers: { Authorization: sessionStorage.getItem('token') }}
      ).then(res => {setModalStatus(false); getData()})
       .catch(err => toast.error("An error occurred"))
    }
  };

  //slot select handler
  const handleSlotSelectEvent = (slotInfo) => {
    setStartDate(new Date(`${slotInfo.start}`));
    setEndDate(new Date(`${slotInfo.end}`));
    setModalStatus(true);
    setEventInput("");
  };

  //move event handler
  const moveEventHandler = ({ event, start, end }) => {
    const body = {
      id: `${event.id}`,
      title: `${event.title}`,
      start: new Date(`${start}`),
      end: new Date(`${end}`),
     }
 
     axios.put(`${process.env.REACT_APP_URL}/calendar`, body,
       { headers: { Authorization: sessionStorage.getItem('token') }}
     ).then(res => {setModalStatus(false); getData()})
      .catch(err => toast.error("An error occurred"))
  };

  //resize event handler
  const resizeEventHandler = ({ event, start, end }) => {
    const body = {
     id: `${event.id}`,
     title: `${event.title}`,
     start: new Date(`${start}`),
     end: new Date(`${end}`),
    }

    axios.put(`${process.env.REACT_APP_URL}/calendar`, body,
      { headers: { Authorization: sessionStorage.getItem('token') }}
    ).then(res => {setModalStatus(false); getData()})
     .catch(err => toast.error("An error occurred"))
  };

  //on select event handler
  const hanldeOnSelectEvent = (e) => {
    setEditStatus(true);
    setStartDate(new Date(`${e.start}`));
    setEndDate(new Date(`${e.end}`));
    setEventInput(e.title);
    setEventId(e.id);
    setModalStatus(true);
  };

  const handleEditEvent = (e) => {
    setEventInput(e.target.value);
  };

  const handleEdited = async (e) => {
    if (eventInput){
      const body = {
        id: `${eventId}`,
        title: `${eventInput}`,
        start: new Date(`${startDate}`),
        end: new Date(`${endDate}`),
      }
      
      await axios.put(`${process.env.REACT_APP_URL}/calendar`, body,
        { headers: { Authorization: sessionStorage.getItem('token') }}
      ).then(res => {setModalStatus(false); getData()})
       .catch(err => toast.error("An error occurred"))
    }

    setEditStatus(false);
    setEventInput("");
  };

  // on delete event handler
  const handleDelete = (e) => {
    axios.delete(`${process.env.REACT_APP_URL}/calendar`,
     {  data: {id: `${eventId}`}, headers: { Authorization: sessionStorage.getItem('token') }}
    ).then(res => {setModalStatus(false); setEventInput(""); getData()})
    .catch(err => toast.error("An error occurred"))
  }

  // get all data
  const getData = async () => {
    await axios(`${process.env.REACT_APP_URL}/calendar`,
      { headers: { Authorization: sessionStorage.getItem('token') }}
    ).then(res => { 
      res.data.data?.forEach(el => {
          el.start = new Date(el.start)
          el.end = new Date(el.end)
      })
      setEvents(res.data.data);
    })
    .catch(err => toast.error("An error occurred getting events"))
  }

  useEffect(() => {
    getData()
  }, [])
  

  return (
    <div className="my-calendar">
      <DnDCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        //event trigger after clicking any slot
        onSelectSlot={handleSlotSelectEvent}
        //event trigger after clicking any event
        onSelectEvent={hanldeOnSelectEvent}
        //event for drag and drop
        onEventDrop={moveEventHandler}
        //event trigger hen resizing any event
        resizable
        onEventResize={resizeEventHandler}
        // onSelecting={slot => false}
        longPressThreshold={10}
      />
      <MyModal
        modalStatus={modalStatus}
        handleClose={handleClose}
        handleSave={handleSave}
        handleChange={handleChange}
        startDate={startDate}
        endDate={endDate}
        eventInput={eventInput}
        handleEditEvent={handleEditEvent}
        handleEdited={handleEdited}
        editStatus={editStatus}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default BigCalendar;