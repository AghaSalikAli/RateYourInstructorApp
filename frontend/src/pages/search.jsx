import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/search.css'; // Reference to the stylesheet

axios.defaults.withCredentials = true;

const Search = () => {
    const [query, setQuery] = useState(''); // State for user input
    const [results, setResults] = useState([]); // State for search results
    const [isLoading, setIsLoading] = useState(false); // State for loading indicator
    const [error, setError] = useState(''); // State for error messages
    const [debouncedQuery, setDebouncedQuery] = useState(''); // Debounced query

    // Debounce the query value
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query); // Update the debounced query after 300ms
        }, 300); // 300ms delay

        return () => {
            clearTimeout(handler); // Clear timeout if user types again
        };
    }, [query]);

    // Fetch results when the debounced query changes
    useEffect(() => {
        const fetchResults = async () => {
            if (debouncedQuery.length < 2) {
                setResults([]); // Clear results if query is too short
                setError('');
                return;
            }

            setIsLoading(true); // Start loading
            try {
                const response = await axios.get(`http://localhost:8000/api/instructor/search?name=${debouncedQuery}`);
                setResults(response.data); // Update search results
                setError('');
            } catch (err) {
                setError('No instructors found.');
                setResults([]);
            } finally {
                setIsLoading(false); // Stop loading
            }
        };

        fetchResults();
    }, [debouncedQuery]);

    return (
        <div className="search-container">
            <h1>Search Page</h1>
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
                />
                {isLoading && <div className="loading-spinner">Loading...</div>}
            </div>
            <div className="search-results">
                {error && <p className="error-message">{error}</p>}
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
        </div>
    );
};

export default Search;
