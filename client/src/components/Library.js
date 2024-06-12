import React from 'react'

const Library = () => {
  return (
    <div className="progress">
            <h2>Progress</h2>
            <div className="progress-bar">
                <div className="progress-completed" style={{ width: '37%' }}></div>
            </div>
            <div className="progress-info">
                <span>37%</span>
                <span>Beginner</span>
            </div>
        </div>
  )
}

export default Library