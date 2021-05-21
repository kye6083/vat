import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Paging from '../component/common/Paging'
import { paging } from '../function/paging'
import { DropDownList } from '@progress/kendo-react-dropdowns'
import DateFilterData from '../component/DateFilterData'
import '@progress/kendo-theme-default/dist/all.css'

const Inquiry = () => {
    const [data, setData] = useState([])
    const [pageSize, setPageSize] = useState('3')
    const [currentPage, setCurrentPage] = useState('1')
    const [totalData, setTotalData] = useState()
    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    useEffect(() => {
        axios.get('http://192.168.123.20:8080/M2550?').then((response) => {
            setData(response.data.content)
            setTotalData(response.data.content.length)
        })
    }, [])

    const pageData = paging(data, currentPage, pageSize) // 페이지 별로 아이템이 속한 배열을 얻어옴

    const [rdoCode, setRdoCode] = useState()
    const [rMonthSYear, setRMonthSYear] = useState(new Date().getFullYear())
    const [rMonthSMonth, setRMonthSMonth] = useState(new Date().getMonth() + 1)
    const [rMonthEYear, setRMonthEYear] = useState(new Date().getFullYear())
    const [rMonthEMonth, setRMonthEMonth] = useState(new Date().getMonth() + 1)
    const [tin, setTin] = useState()
    const [rTName, setRTName] = useState()

    const amendedList = ['All', 'Yes', 'No']
    const [amended, setAmended] = useState()
    const nowY = new Date().getFullYear()
    const yearListArr = []
    const monthListArr = []
    for (let y = 2000; y <= nowY; y++) {
        yearListArr.push(y)
    }
    for (let m = 1; m < 13; m++) {
        monthListArr.push(m)
    }

    const rdoCodeCh = (e) => {
        setRdoCode(e.target.value)
    }
    // 날짜 버튼 클릭, 기간 변경 기능
    const handleBtnClicked = (e) => {
        const { value } = e.target
        let varMonth = ''
        if (value === 'this month') {
            varMonth = new Date().getMonth() + 1
        }
        if (value === 'previous 2 months') {
            varMonth = new Date().getMonth() - 1
        }
        if (value === 'previous 3 months') {
            varMonth = new Date().getMonth() - 2
        }
        setRMonthSMonth(varMonth)
        console.log(varMonth)
    }
    const searchForm = (e) => {
        e.preventDefault()
        console.log('rdoCode= ' + rdoCode)
        console.log('amended= ' + amended)
        console.log('rMonthSYear= ' + rMonthSYear)
        console.log('rMonthSMonth= ' + rMonthSMonth)
        console.log('rMonthEYear= ' + rMonthEYear)
        console.log('rMonthEMonth= ' + rMonthEMonth)
        console.log('tin= ' + tin)
        console.log('rTName= ' + rTName)
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
                                defaultItem="All"
                                onChange={(e) => setAmended(e.target.value)}
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
                                value={rdoCode}
                                onChange={(e) => setTin(e.target.value)}
                            />
                        </div>
                        <div className="ml-5">Registered Name / Trade Name</div>
                        <div className="ml-4">
                            <input
                                type="text"
                                value={rdoCode}
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
                            <th>ID</th>
                            <th>Title</th>
                            <th>Genre</th>
                            <th>Release</th>
                            <th>Release2</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageData.map((data) => (
                            <tr key={data.referenceNo}>
                                <td>{data.referenceNo}</td>
                                <td>{data.tin}</td>
                                <td>{data.m2550HDto.substreet}</td>
                                <td>{data.m2550HDto.street}</td>
                                <td>{data.m2550HDto.barangay}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Paging
                    pageSize={pageSize}
                    itemsCount={totalData}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            </div>
        </>
    )
}

export default Inquiry
