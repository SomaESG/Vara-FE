import React, { useState, useEffect } from 'react';
import { generalFunction } from '../../assets/Config/generalFunction'
import  Button from '../Common/CommonComponents/Button'
import  Table from '../Common/CommonComponents/Table'
import PopUp from '../Common/CommonComponents/PopUp'

export default function LCA() {
  const [tableData, setTableData] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newRowData, setNewRowData] = useState({ id: '', lca_name: '', co2: '', last_edited: '', summary: '' });

  const fields = [
    { id: 'id', label: 'LCA ID', type: 'number', link: true},
    { id: 'lca_name', label: 'LCA Name', type: 'text' },
    { id: 'co2', label: 'CO2 Consumption', type: 'text' },
    { id: 'last_edited', label: 'Last Edited', type: 'date' },
    { id: 'summary', label: 'Summary', type: 'text' },
  ];

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await generalFunction.fetchProductInformation();
        setTableData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    getData(); 
  }, [])

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    //can I do this to create new lca??
    generalFunction.createLCA(newRowData);
    setNewRowData({ id:'', lca_name: '', co2: '', last_edited: '', summary: '' });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRowData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleAddRow = () => {
    setTableData((prevData) => [...prevData, newRowData]);
    handleClosePopup();
  };

  return (
    <div className="flex flex-col justify-center overflow-hidden mt-20 p-6">
      <h1 className="text-xl text-center mb-10">Product LCA</h1>

      <Table
        fields={fields}
        tableData={AllProjects}
        pageLink="/product_footprint/details/"
      />
      <div className="mb-6 mt-10 flex items-center justify-center">
        <Button
          label="Add Product"
          handleFunction = {handleOpenPopup}
        />
      </div>
      {isPopupOpen && (
        <PopUp
          fields={fields}
          newRowData={newRowData}
          handleInputChange={handleInputChange}
          handleClosePopup={handleClosePopup}
          handleAddRow={handleAddRow}
        />
      )}
    </div>

  );
}
