import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/search.css'; // Reference to the stylesheet

axios.defaults.withCredentials = true;

const Search = () => {
    const [query, setQuery] = useState(''); 
    const [results, setResults] = useState([]); 
    const [isLoading, setIsLoading] = useState(false); 
    const [error, setError] = useState(''); 
    const [debouncedQuery, setDebouncedQuery] = useState(''); // Debounced query

    
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query); 
        }, 300);

        return () => {
            clearTimeout(handler); // Clear timeout if user types again
        };
    }, [query]);

    
    useEffect(() => {
        const fetchResults = async () => {
            if (debouncedQuery.length < 2) {
                setResults([]); 
                setError('');
                return;
            }

            setIsLoading(true); 
            try {
                const response = await axios.get(`http://localhost:8000/api/instructor/search?name=${debouncedQuery}`);
                setResults(response.data); // Update search results
                setError('');
            } catch (err) {
                setError('No instructors found.');
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [debouncedQuery]);

    return (
        <div className="search-container">
            <h1>Search an Instructor</h1>
            <div className="mt-3">
                <p>
                    View by department? <Link to="/departments">Click here</Link>
                </p>
            </div>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Type an instructor's name..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="search-input"
                />
                {isLoading && <div className="loading-spinner">Loading...</div>}
            </div>
            <div className="search-results">
                {error && <p className="error-message">{error}</p>}
                {results.length > 0 && (
                    <div className="results-list">
                        {results.map((instructor) => (
                            <Link
                                key={instructor.Instructor_ID}
                                to={`/instructor/${instructor.Instructor_ID}`}
                                className="result-item"
                            >
                                <strong>{instructor.Instructor_Name}</strong>
                                <p>{instructor.Department_Name}</p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
