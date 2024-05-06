// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Switch } from 'react-router-dom';
import DashBoard from './DashBoard';
import Login from './Login';
import SignUp from './SignUp';

import TextEditor from './TextEditor';

function App() {
    return (
        <div>
            <Router>
                <div>
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/dashboard" element={<DashBoard />} />

                        <Route path="/editor" element={<TextEditor />} />

                    </Routes>

                </div>

            </Router>

        </div>

    );
}

export default App;
