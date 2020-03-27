import React, { useState, useEffect, useContext } from 'react'
import AppContext from './AppContext'
import {
  Container,
  Card,
  CardDeck,
  InputGroup,
  Table,
  FormControl
} from 'react-bootstrap'
import axios from './api'

export default () => {
  const { theme, changeTheme } = useContext(AppContext.ThemeContext)
  const { language, changeLanguage } = useContext(AppContext.LanguageContext)

  const [totalCases, setTotalCases] = useState(0)
  const [totalDeaths, setTotalDeaths] = useState(0)
  const [totalRecovered, setTotalRecovered] = useState(0)

  const [dataCountry, setDataCountry] = useState([])
  const [dataTakenTime, setDataTakenTime] = useState('')
  const [filteredCountry, setFilteredCountry] = useState([])
  const [filterText, setFilterText] = useState('')

  const style = {
    cardHeader: {
      fontSize: '20px'
    }
  }

  useEffect(() => {
    axios
      .get(
        'https://coronavirus-monitor.p.rapidapi.com/coronavirus/worldstat.php'
      )
      .then(response => {
        // console.log(response.data)
        setTotalCases(response.data.total_cases)
        setTotalDeaths(response.data.total_deaths)
        setTotalRecovered(response.data.total_recovered)
      })
      .catch(error => {
        console.log(error)
      })

    axios
      .get(
        'https://coronavirus-monitor.p.rapidapi.com/coronavirus/cases_by_country.php'
      )
      .then(response => {
        // console.log(response.data)
        setDataCountry([...response.data.countries_stat])
        setFilteredCountry([...response.data.countries_stat])
        setDataTakenTime(response.data.statistic_taken_at)
      })
      .catch(error => {
        console.log(error)
      })
  }, [])

  const handleChangeFilter = e => {
    // console.log(e.target.value)
    setFilterText(e.target.value)
    const newFilter = dataCountry.filter(data =>
      data.country_name.toLowerCase().includes(e.target.value.toLowerCase())
    )

    setFilteredCountry([...newFilter])
  }

  const getList = () => {
    const listCountry = filteredCountry.map((data, idx) => (
      <tr key={idx}>
        <td>{data.country_name}</td>
        <td>{data.cases}</td>
        <td>{data.deaths}</td>
        <td>{data.total_recovered}</td>
        <td>{data.new_deaths}</td>
        <td>{data.new_cases}</td>
        <td>{data.serious_critical}</td>
        <td>{data.active_cases}</td>
      </tr>
    ))

    return listCountry
  }

  return (
    <Container>
      <CardDeck>
        <Card
          bg={theme === 'dark' ? 'dark' : 'light'}
          text={theme === 'dark' ? 'light' : 'dark'}
        >
          <Card.Header style={style.cardHeader}>Total Cases</Card.Header>
          <Card.Body>
            <Card.Title>{totalCases}</Card.Title>
          </Card.Body>
        </Card>
        <Card bg="danger" text="white">
          <Card.Header style={style.cardHeader}>Total Deaths</Card.Header>
          <Card.Body>
            <Card.Title>{totalDeaths}</Card.Title>
          </Card.Body>
        </Card>
        <Card bg="success" text="white">
          <Card.Header style={style.cardHeader}>Total Recovered</Card.Header>
          <Card.Body>
            <Card.Title>{totalRecovered}</Card.Title>
          </Card.Body>
        </Card>
        <Card bg="info" text="white">
          <Card.Header style={style.cardHeader}>Statistic Taken At</Card.Header>
          <Card.Body>
            <Card.Title>{dataTakenTime}</Card.Title>
          </Card.Body>
        </Card>
      </CardDeck>

      <br />

      <Card bg={theme === 'dark' ? 'dark' : 'light'}>
        <Card.Body>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Search Country"
              aria-label="Search Country"
              aria-describedby="basic-addon2"
              value={filterText}
              onChange={e => handleChangeFilter(e)}
            />
          </InputGroup>
          <Table
            striped
            bordered
            hover
            variant={theme === 'dark' ? 'dark' : 'light'}
            responsive
          >
            <thead>
              <tr>
                <th>Country Name</th>
                <th>Cases</th>
                <th>Deaths</th>
                <th>Recovered</th>
                <th>New Deaths</th>
                <th>New Cases</th>
                <th>Serious Critical</th>
                <th>Active Cases</th>
              </tr>
            </thead>
            <tbody>{getList()}</tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  )
}
