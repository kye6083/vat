import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Paging from '../component/common/Paging'
import { paging } from '../function/paging'
import { DropDownList } from '@progress/kendo-react-dropdowns'
import DateFilterData from '../component/DateFilterData'
import '@progress/kendo-theme-default/dist/all.css'
import _ from 'lodash'
import Select from 'react-select'

const Inquiry = () => {
    const [data, setData] = useState([])
    const [haveDataPage, setHaveDataPage] = useState([])
    const [pageSize, setPageSize] = useState('3')
    const [currentPage, setCurrentPage] = useState('1')
    const [totalData, setTotalData] = useState()
    const handlePageChange = (page) => {
        setCurrentPage(page)
    }
    const [fixUrl, setFixUrl] = useState('http://192.168.123.20:8080/M2550/search/?')
    const [varUrl, setVarUrl] = useState('')

    useEffect(() => {
        axios.get(varUrl).then((response) => {
            setData(response.data.content)
            if (varUrl !== '') {
                setHaveDataPage(response.data.page)
                setTotalData(response.data.content.length)
            }
        })
        console.log('varUrl= ' + varUrl)
    }, [varUrl])

    const pageData = paging(data, currentPage, pageSize) // 페이지 별로 아이템이 속한 배열을 얻어옴

    const [rdoCode, setRdoCode] = useState('')
    // const [rMonthSYear, setRMonthSYear] = useState(new Date().getFullYear())
    // const [rMonthSMonth, setRMonthSMonth] = useState(new Date().getMonth() + 1)
    // const [rMonthEYear, setRMonthEYear] = useState(new Date().getFullYear())
    // const [rMonthEMonth, setRMonthEMonth] = useState(new Date().getMonth() + 1)
    const [rMonthSYear, setRMonthSYear] = useState('')
    const [rMonthSMonth, setRMonthSMonth] = useState('')
    const [rMonthEYear, setRMonthEYear] = useState('')
    const [rMonthEMonth, setRMonthEMonth] = useState('')
    const [tin, setTin] = useState('')
    const [rTName, setRTName] = useState('')

    const amendedList = [
        { value: '', label: 'All' },
        { value: 'Y', label: 'Yes' },
        { value: 'N', label: 'No' },
    ]
    const [amended, setAmended] = useState('')
    const nowY = new Date().getFullYear()
    const yearListArr = []
    const monthListArr = []
    for (let y = 2000; y <= nowY; y++) {
        yearListArr.push(y)
    }
    for (let m = 1; m < 13; m++) {
        let _m = m.toString()
        if (_m.length < 2) {
            _m = '0' + _m
        }
        monthListArr.push(_m)
    }

    const rdoCodeCh = (e) => {
        setRdoCode(e.target.value)
    }
    // 날짜 버튼 클릭, 기간 변경 기능
    const handleBtnClicked = (e) => {
        const { value } = e.target
        const now = new Date()
        let imsiDate = ''
        let varMonth = ''
        let varYear = ''
        const nowY = new Date().getFullYear()
        let nowM = new Date().getMonth() + 1
        nowM = ('0' + nowM).slice(-2)
        if (value === 'this month') {
            varYear = now.getFullYear()
            varMonth = now.getMonth() + 1
        }
        if (value === 'previous 2 months') {
            imsiDate = new Date(now.setMonth(now.getMonth() - 1))
            varYear = imsiDate.getFullYear()
            varMonth = imsiDate.getMonth()
        }
        if (value === 'previous 3 months') {
            imsiDate = new Date(now.setMonth(now.getMonth() - 2))
            varYear = imsiDate.getFullYear()
            varMonth = imsiDate.getMonth()
        }
        varMonth = ('0' + varMonth).slice(-2)
        setRMonthSYear(varYear)
        setRMonthSMonth(varMonth)
        setRMonthEYear(nowY)
        setRMonthEMonth(nowM)
    }

    const searchForm = (e) => {
        e.preventDefault()
        let _url = ''
        if (rdoCode !== '') {
            _url += 'rdo=' + rdoCode + '&'
        }
        if (amended !== '') {
            _url += 'amendedYn=' + amended + '&'
        }
        if (rMonthSYear !== '') {
            _url += 'sy=' + rMonthSYear + '&'
        }
        if (rMonthSMonth !== '') {
            _url += 'sm=' + rMonthSMonth + '&'
        }
        if (rMonthEYear !== '') {
            _url += 'ey=' + rMonthEYear + '&'
        }
        if (rMonthEMonth !== '') {
            _url += 'em=' + rMonthEMonth + '&'
        }
        if (tin !== '') {
            _url += 'tin=' + tin + '&'
        }
        if (rTName !== '') {
            _url += 'regName=' + rTName + '&'
        }
        //let _varUrl = fixUrl + _url + 'size=' + haveDataPage
        let _varUrl = fixUrl + _url
        setVarUrl(_varUrl)
        console.log('_varUrl= ' + _varUrl)
    }

    if (totalData === 0) return <p>No Data...</p>

    return (
        <>
            <form onSubmit={searchForm}>
                <div className="container">
                    <div className="row d-flex">
                        <div>RDO code</div>
                        <div className="ml-4">
                            <input
                                type="text"
                                value={rdoCode}
                                className="form-control"
                                onChange={rdoCodeCh}
                            />
                        </div>
                        <div className="ml-5">RDO Name</div>
                        <div className="ml-4">
                            <input type="text" className="form-control" readOnly />
                        </div>
                        <div className="ml-5">Amended return</div>
                        <div className="ml-4">
                            <DropDownList
                                data={amendedList}
                                className="selectbox"
                                textField="label"
                                dataItemKey="value"
                                onChange={(e) => setAmended(e.target.value.value)}
                            />
                        </div>
                    </div>
                    <div className="row d-flex mt-3">
                        <div className="ml-4">Return Month</div>
                        <div className="ml-4">
                            <DropDownList
                                data={yearListArr}
                                defaultItem="YYYY"
                                value={rMonthSYear}
                                className="form-control"
                                onChange={(e) => setRMonthSYear(e.target.value)}
                            />
                        </div>
                        <div className="ml-4">
                            <DropDownList
                                data={monthListArr}
                                value={rMonthSMonth}
                                className="form-control"
                                onChange={(e) => setRMonthSMonth(e.target.value)}
                            />
                        </div>
                        <div className="ml-4">&nbsp; - &nbsp;</div>
                        <div className="ml-4">
                            <DropDownList
                                data={yearListArr}
                                value={rMonthEYear}
                                className="form-control"
                                onChange={(e) => setRMonthEYear(e.target.value)}
                            />
                        </div>
                        <div className="ml-4">
                            <DropDownList
                                data={monthListArr}
                                value={rMonthEMonth}
                                className="form-control"
                                onChange={(e) => setRMonthEMonth(e.target.value)}
                            />
                        </div>
                        <ul className="d-flex">
                            {DateFilterData.map((el, idx) => (
                                <li key={idx} className="ml-5">
                                    <input
                                        onClick={handleBtnClicked}
                                        type="button"
                                        className="form-control"
                                        value={el.value}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="row mt-3">
                        <div>Taxpayer's TIN</div>
                        <div className="ml-4">
                            <input
                                type="text"
                                value={tin}
                                onChange={(e) => setTin(e.target.value)}
                            />
                        </div>
                        <div className="ml-5">Registered Name / Trade Name</div>
                        <div className="ml-4">
                            <input
                                type="text"
                                value={rTName}
                                onChange={(e) => setRTName(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="row mt-3 d-flex justify-content-center">
                    <button type="submit" className="btn btn-primary">
                        Search
                    </button>
                </div>
            </form>
            <div className="container">
                <p className="text-left">{totalData} 개의 정보가 있습니다.</p>

                <table className="table table-hover table-bordered">
                    <thead>
                        <tr>
                            <th rowSpan="2">
                                Return
                                <br />
                                Date
                            </th>
                            <th rowSpan="2">
                                How to VAT
                                <br />
                                return
                            </th>
                            <th colSpan="2">RDO</th>
                            <th rowSpan="2">Return Month</th>
                            <th rowSpan="2">
                                Amended
                                <br />
                                Return
                            </th>
                            <th rowSpan="2">TIN</th>
                            <th rowSpan="2">Registered Name</th>
                            <th rowSpan="2">
                                Total
                                <br />
                                Output Tax Due
                                <br />
                                (1)D
                            </th>
                            <th rowSpan="2">
                                Total Allowable
                                <br />
                                Input Tax
                                <br />
                                (2)
                            </th>
                            <th rowSpan="2">
                                Net VAT Payable
                                <br />
                                <br />
                                (3)=(1)-(2)
                            </th>
                            <th rowSpan="2">
                                Total Tax Credit
                                <br />
                                /Payments
                                <br />
                                (4)
                            </th>
                            <th rowSpan="2">
                                Penalties
                                <br />
                                <br />
                                (5)
                            </th>
                            <th rowSpan="2">
                                Total Amont Payable
                                <br />
                                (6)
                                <br />
                                =(3)-(4)+(5)
                            </th>
                        </tr>
                        <tr>
                            <th>Code</th>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageData.map((data) => (
                            <tr key={data.referenceNo}>
                                <td>{data.retrnPeriod}</td>
                                <td>eFPS</td>
                                <td>{data.m2550HDto.rodCode}</td>
                                <td>North Quezon city</td>
                                <td>07/2018</td>
                                <td>{data.amendedYn}</td>
                                <td>
                                    {data.tin}-{data.branchCode}
                                </td>
                                <td>
                                    {data.m2550HDto.registeredName}
                                    {data.m2550HDto.lastName} {data.m2550HDto.firstName}
                                    {data.m2550HDto.midName}
                                </td>

                                <td>{data.totalOutputTaxMo}</td>
                                <td>{data.totalAllowInputTax}</td>
                                <td>{data.netPayble}</td>
                                <td>{data.totalCredAmt}</td>
                                <td>{data.penalties}</td>
                                <td>{data.totalAmtPaybl}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Paging
                    pageSize={pageSize}
                    itemsCount={totalData}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    // setHaveDataPage={setHaveDataPage}
                />
            </div>
        </>
    )
}

export default Inquiry
