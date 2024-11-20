import React from 'react'
import { Link } from 'react-router-dom';

const search = () => {
  return (
    <div>
        <h1>Search Page</h1>
          <div className="mt-3">
            <p>View by department? <Link to="/departments">Click here</Link></p>
          </div>
    </div>
  )
}

export default search