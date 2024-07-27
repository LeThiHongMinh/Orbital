import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getNotes, downloadNotes, downloadmatchedNotes } from '../api/auth';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { getFilesForMatchedUsers } from '../api/auth';
import { useSelector } from 'react-redux';
const PrivateCourse = ({courseCode}) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const isDarkMode = useSelector((state) => state.ui.isDarkMode); 

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await getFilesForMatchedUsers();
        const data = response.data;
        if (data.success) {
          setFiles(data.files.filter(file => file.course_code === courseCode));
        } else {
          console.error('Error fetching files');
        }
      } catch (error) {
        console.error('Error fetching files:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const handleViewPDF = async (fileId) => {
    try {
      const blobData = await downloadmatchedNotes(fileId);
      setSelectedFile(blobData);

    } catch (error) {
      console.error('Error fetching PDF:', error.message);
    }
  };
  

  const handleClosePDF = () => {
    setSelectedFile(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">Uploaded Files</h2>
      <ul>
        {files.map(file => (
          <li key={file.id} className="mb-4">
            <div className="border p-4 rounded">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="text-xl font-bold">{file.name}</h3>
                  <p>{file.description}</p>
                  <p>{file.course_code}</p>
                </div>
                <button
  onClick={() => handleViewPDF(file.id)}
  className={`ml-72 text-white font-bold py-2 px-10 rounded focus:outline-none focus:shadow-outline ${
    isDarkMode ? 'bg-purple-500 hover:bg-purple-700' : 'bg-red-500 hover:bg-red-700'
  }`}
>
  View PDF
</button>

              </div>
            </div>
          </li>
        ))}
      </ul>

      {selectedFile && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded shadow-lg max-w-3xl w-full h-full overflow-auto">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <Viewer fileUrl={URL.createObjectURL(new Blob([selectedFile], { type: 'application/pdf' }))} />
            </Worker>
            <button
              onClick={handleClosePDF}
              className="absolute top-4 right-4 bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivateCourse;