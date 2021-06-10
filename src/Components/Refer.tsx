import React, {useRef, useState} from 'react';
import validator from "validator";
import CssTextField from "@material-ui/core/TextField";
import {CopyToClipboard} from "react-copy-to-clipboard";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import {makeStyles} from "@material-ui/core/styles";
import axios, {AxiosError} from 'axios'

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

function Refer(props: any) {
    const classes = textUseStyles();
    const textFieldRef = useRef(null);
    const [link, setLink] = useState("");
    // https://developer.mozilla.org/en-us/docs/web/javascript/reference/global_objects/string/length
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
        const short = textFieldRef.current.value.toLowerCase();
        console.log(`link: ${short}`)
        if (short.length === 6) {
            axios.get('/refer', {
                params: {
                    short: short
                }
            }).then((res) => {
                console.log(res);
                console.log(res.data.link)
                setLink(res.data.link)
            });
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
                        label="Enter shortened link"
                        inputRef={textFieldRef}
                        color="secondary"
                    />
                </form>
                {
                    link === "" ? "" :
                        <div className="long-link-area">
                            <div className="badge">{link === "" ? "" : `URL: `}</div>

                            <CopyToClipboard text={link} onCopy={handleClick}>
                                <button className="btn btn-warning long-link-area__code">
                                    {link}
                                </button>
                            </CopyToClipboard>
                            <div className="new-window__container">
                                <a
                                    href={link}
                                    rel="noopener noreferrer"
                                    target={"_blank"}
                                    className="badge badge-sm badge-danger new-window__btn"
                                >
                                    Open In New Window
                                </a>
                            </div>

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

export default Refer;
