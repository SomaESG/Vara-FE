import React, { useState, useEffect } from 'react';
import { generalFunction } from '../../assets/Config/generalFunction'
import  Button from '../Common/CommonComponents/Button'
import  Table from '../Common/CommonComponents/Table'
import PopUp from '../Common/CommonComponents/PopUp'
import DescriptionArea from '../Common/CommonComponents/DescriptionArea'
import { useParams } from 'react-router-dom';

// {
//   Todo -
//   1. Change the DB to get companu specific data
//   2. Add Edit Button to the Table
// }

export default function ProjectPage() {
  const project_fields = [
    { id: 'project_id', label: 'Project ID', type: 'number' },
    { id: 'project', label: 'Project', type: 'text' },
    { id: 'status', label: 'Status', type: 'text' },
    { id: 'due_date', label: 'Due Date', type: 'text' },
    { id: 'lead', label: 'Lead', type: 'text' },
  ];

  const task_fields = [
    { id: 'project_id', label: 'Project ID', type: 'number', table: false, popup: false},
    { id: 'task_id', label: 'Task ID', type: 'number', table: true, popup: false},
    { id: 'task', label: 'Task', type: 'text', table: true, popup: true},
    { id: 'status', label: 'Status', type: 'text', table: true, popup: true},
    { id: 'due_date', label: 'Due Date', type: 'text', table: true, popup: true},
    { id: 'lead', label: 'Lead', type: 'text', table: true, popup: true},
    { id: 'description', label: 'Description', type: 'text', table: true, popup: true}
  ];

  // Get project ID
  const { id } = useParams();
  // Get all info of the project
  const [ProjectInfo, setProjectInfo] = useState([]);
  const [description, setDescription] = useState('');
  // Get all tasks of the project
  const [AllTasks, setAllTasks] = useState([]);
  const [newTask, setTask] = useState({ 
    task_id: '',
    task: '', 
    status: '',
    due_date: '',
    lead: '',
    description: ''
  });
  const [taskTracker, setTaskTracker] = useState(0);
  // PopUp for tasks
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        // Get project data
        const project_info = await generalFunction.getTableRow(`project_management`, "project_id", id);
        setProjectInfo(project_info);
        setDescription(project_info[0].description);
        // Get task data
        const data = await generalFunction.getTableData(`task_management`);
        setAllTasks(data);
        setTaskTracker(data.length + 1)
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    getData(); 
  }, [])

    // Function to save description
    const handleChange = (e) => {
      setDescription(e.target.value);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      generalFunction.updateRow(
        `project_management`,
        "description",
        description,
        "project_id",
        id
      );
    };

  // Function to save tasks
  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const getTaskNumber = async () => {
    const data = await generalFunction.getTableData(`task_management`);
    setTaskTracker(data.length + 1)
  }

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    getTaskNumber();    
    const newTask_ = { 
        project_id: id,
        task_id: taskTracker,
        task: newTask.task, 
        status: newTask.status,
        due_date: newTask.due_date,
        lead: newTask.lead,
        description: newTask.description
    }
    generalFunction.createTableRow(`task_management`, newTask_);
    setTask({ 
      task_id: '',
      task: '', 
      status: '',
      due_date: '',
      lead: '',
      description: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTask((prevData) => ({
      ...prevData,
      task_id: taskTracker,
      [name]: value,
    }));
  };
  
  const handleAddRow = () => {
    setAllTasks((prevData) => [...prevData, newTask]);
    handleClosePopup();
  };


  const TaskTable = task_fields.filter(field => field.table);
  const TaskPopUp = task_fields.filter(field => field.popup);

  return (
    <div className="flex flex-col justify-center overflow-hidden mt-20 p-6">
      <h1 className="text-xl text-center mb-10">Project Page Test</h1>
      <Table
        fields={project_fields}
        tableData={ProjectInfo}
      />
      <DescriptionArea
        description={description}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
      />
      <Table
        fields={TaskTable}
        tableData={AllTasks}
      />
      <div className="mb-6 mt-10 flex items-center justify-center">
        <Button
          label="Add Task"
          handleFunction = {handleOpenPopup}
        />
      </div> 
      {isPopupOpen && (
        <PopUp
          fields={TaskPopUp}
          newRowData={newTask}
          handleInputChange={handleInputChange}
          handleClosePopup={handleClosePopup}
          handleAddRow={handleAddRow}
        />
      )}
    </div>
  );
}