import React, {useEffect, useState} from 'react';
import '@progress/kendo-theme-default/dist/all.css';
import './App.css';

import Shortify from "./Components/Shortify";
import "./styles/themes.css"
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import {BiLink} from "react-icons/bi";
import {VscReferences} from "react-icons/vsc";
import {AiOutlineBarChart} from "react-icons/ai";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import {makeStyles} from "@material-ui/core/styles";
import Refer from "./Components/Refer";
import Dashboard from "./Components/Dashboard";

const navUseStyles = makeStyles({
    root: {
        width: "100%",
        position: "fixed",
        // top: "30px",
        top: "40px",
        backgroundColor: "#2f3241"

    },
});
const App = () => {

    const navClasses = navUseStyles();
    const [navValue, setNavValue] = useState('Shortify');
    const handleNavChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setNavValue(newValue);
    };
    return (
        <div className="App ">
            <BottomNavigation value={navValue} onChange={handleNavChange} className={navClasses.root}>
                <BottomNavigationAction label="Shortify" className="nav-btn" value="Shortify"
                                        icon={<BiLink className="nav-btn__icon"/>}/>
                <BottomNavigationAction label="Refer" className="nav-btn" value="Refer"
                                        icon={<VscReferences className="nav-btn__icon"/>}/>
                <BottomNavigationAction label="Dashboard" className="nav-btn" value="Dashboard"
                                        icon={<AiOutlineBarChart className="nav-btn__icon"/>}/>
            </BottomNavigation>

            {
                navValue === "Shortify" ?
                    <Shortify/> :
                    navValue === "Refer" ?
                        <Refer/> :
                        navValue === "Dashboard" ?
                            <Dashboard/> :
                            ""
            }

        </div>
    );
}

export default App;
