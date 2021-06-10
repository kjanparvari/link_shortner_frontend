import React, {useEffect, useRef, useState} from 'react';
import * as ReactDOM from "react-dom";
import axios, {AxiosError} from 'axios'
import '../styles/Dashboard.css'
import "hammerjs";
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import {Table} from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css'
import {
    Chart,
    ChartSeries,
    ChartSeriesItem,
    ChartValueAxis,
    ChartValueAxisItem,
    ChartCategoryAxis,
    ChartCategoryAxisItem,
} from "@progress/kendo-react-charts";

const {Column, HeaderCell, Cell, Pagination} = Table;
const makeSeries = (obj: any) => {
    return Object.keys(obj).sort().filter((key) => key !== 'all').map((key) => {
        const [year, month, day] = key.split('-');
        return {
            category: new Date(parseInt(year), parseInt(month), parseInt(day)),
            value: parseInt(obj[key])
        }


    })
}

const categoryAxisMax = new Date(2000, 1, 0);
const categoryAxisMaxDivisions = 10;

const selectKeys = ['new links', 'refers', 'top n', 'all']

const Dashboard = (props: any) => {
    const newInfoSampleSeries = {
        "2021-06-05": "1",
        "2021-06-04": "4",
        "2021-06-03": "9",
        "2021-06-02": "7",
        "2021-06-06": "1",
        "2021-06-08": "0",
        "2021-06-07": "2",
        "2021-06-09": "4",
        "2021-06-10": "7",
        "2021-06-11": "4",
        "all": "1"
    };
    const [series, setSeries] = useState(newInfoSampleSeries);
    const [tableData, setTableData] = useState([])
    const [select, setSelect] = React.useState('');
    const [topnNumber, setTopnNumber] = React.useState(3);
    const handleSelectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelect(event.target.value as string);
    };
    useEffect(() => {
        // default choose info
        setSelect(() => 'new links');
    }, [])

    useEffect(() => {
        if (select === 'new links') {
            axios.get('/newinfo').then((res) => {
                console.log(res.data);
                setSeries(() => res.data);
            });
        } else if (select === 'refers') {
            axios.get('/refinfo').then((res) => {
                console.log(res.data);
                setSeries(() => res.data);
            });
        } else if (select === 'all') {
            axios.get('/all').then((res) => {
                console.log(res.data)
                setTableData(() => res.data)
            })
        } else if (select === 'top n') {
            axios.get('/topn', {
                params: {
                    number: topnNumber
                }
            }).then((res) => {
                console.log(res.data)
                setTableData(() => res.data)
            })
        }

    }, [select, topnNumber])

    return (
        <div className="dashboard">
            <div className="chart__select__container">
                <InputLabel className="text-white" id="demo-simple-select-label">Choose Info</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={select}
                    className="chart__select text-white"
                    onChange={handleSelectChange}
                >
                    {
                        selectKeys.map((value, index, array) => {
                            return <MenuItem value={value}>{value}</MenuItem>
                        })
                    }
                </Select>
            </div>
            <div className="number-input__container">
                {
                    select === "top n" ?
                        <input className="number-input form-control" value={topnNumber} type="number" onChange={(e) => {
                            setTopnNumber(() => parseInt(e.target.value))
                        }}/> :
                        ""
                }
            </div>

            {
                select === "new links" || select === "refers" ?
                    <div className="chart__container">
                        <Chart pannable zoomable>
                            <ChartCategoryAxis>
                                <ChartCategoryAxisItem
                                    max={categoryAxisMax}
                                    maxDivisions={categoryAxisMaxDivisions}
                                />
                            </ChartCategoryAxis>
                            <ChartValueAxis>
                                <ChartValueAxisItem labels={{visible: true, format: "#.00"}}/>
                            </ChartValueAxis>
                            <ChartSeries>
                                <ChartSeriesItem data={makeSeries(series)} field="value" categoryField="category"/>
                            </ChartSeries>
                        </Chart>
                    </div> :
                    select === "all" || select === "top n" ?
                        <Table
                            height={400}
                            width={325}
                            data={tableData}
                            style={{borderRadius: 25, color: 'black'}}
                            onRowClick={data => {
                                console.log(data);
                            }}
                        >
                            <Column width={80} align="center" fixed>
                                <HeaderCell>Shortened</HeaderCell>
                                <Cell dataKey="short"/>
                            </Column>

                            <Column width={60}>
                                <HeaderCell>refers</HeaderCell>
                                <Cell dataKey="refs"/>
                            </Column>

                            <Column width={150}>
                                <HeaderCell>TTL</HeaderCell>
                                <Cell dataKey="ttl"/>
                            </Column>
                            <Column width={500}>
                                <HeaderCell>URL</HeaderCell>
                                <Cell dataKey="link"/>
                            </Column>

                            {/*<Column width={120} fixed="right">*/}
                            {/*    <HeaderCell>Action</HeaderCell>*/}

                            {/*    <Cell>*/}
                            {/*        {(rowData: any) => {*/}
                            {/*            function handleAction() {*/}
                            {/*                alert(`id:${rowData.id}`);*/}
                            {/*            }*/}

                            {/*            return (*/}
                            {/*                <span>*/}
                            {/*                    <a onClick={handleAction}> Edit </a> |{' '}*/}
                            {/*                    <a onClick={handleAction}> Remove </a>*/}
                            {/*                    </span>*/}
                            {/*            );*/}
                            {/*        }}*/}
                            {/*    </Cell>*/}
                            {/*</Column>*/}
                        </Table> : " "
            }


        </div>
    );
}

export default Dashboard;