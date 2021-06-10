import React, {useEffect, useRef, useState} from 'react';
import '../styles/mainPage.css'
import axios, {AxiosError} from 'axios'
import {makeStyles} from "@material-ui/core/styles";
import CssTextField from '@material-ui/core/TextField';
import validator from 'validator'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';


const textUseStyles = makeStyles((theme) => ({
    root: {
        flexBasis: "80%",
        '& .MuiInput-underline:before': {
            borderBottomColor: 'white',
            // backgroundColor: 'gold',
            textAlign: 'center',
        },
        "& > *": {
            color: "white",
            borderColor: "white",
            fontSize: "20px"
        }

    }
}));

const Shortify = (props: any) => {
    const classes = textUseStyles();
    const textFieldRef = useRef(null);
    const [short, setShort] = useState("");
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };
    const submitHandler = (e: any) => {
        e.preventDefault();
        // @ts-ignore
        let link = textFieldRef.current.value.toLowerCase();
        console.log(`link: ${link}`)
        if (link !== "" && validator.isURL(link)) {
            if (link.search(/^http[s]?\:\/\//) == -1)
                link = 'http://' + link;

            axios.get('/shorten', {
                params: {
                    link: link
                }
            }).then((res) => {
                console.log(res);
                console.log(res.data.short)
                setShort(res.data.short)
            })
        }
    }
    return (
        <div className="main-page">


            <div className="form-container">
                <form className="my-form" onSubmit={submitHandler}>
                    <CssTextField
                        size="medium"
                        id="standard-basic"
                        // value={link}
                        // onSubmit={submitHandler}
                        classes={classes}
                        label="Enter long url to shorten it"
                        inputRef={textFieldRef}
                        color="secondary"
                    />
                </form>
                {
                    short === "" ? "" :
                        <div className="shorted-link-area">
                            <div className="badge">{short === "" ? "" : `Your Shortened Link Is: `}</div>

                            <CopyToClipboard text={short} onCopy={handleClick}>
                                <button className="btn btn-warning btn-sm shorted-link-area__code">
                                    {short}
                                </button>
                            </CopyToClipboard>
                        </div>
                }

                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    open={open}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    message="Copied"
                    action={
                        <React.Fragment>
                            {/*<Button color="secondary" size="small" onClick={handleClose}>*/}
                            {/*    UNDO*/}
                            {/*</Button>*/}
                            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                                <CloseIcon fontSize="small"/>
                            </IconButton>
                        </React.Fragment>
                    }
                />
            </div>
        </div>
    );
}

export default Shortify;