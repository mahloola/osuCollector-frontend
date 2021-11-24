import { useContext } from 'react'
import Chart from 'react-google-charts'
import { ThemeContext } from 'styled-components';
import './BarGraph.css'

const BarGraph = ({ chartEvents, data, enableInteractivity=false, height }) => {
    const theme = useContext(ThemeContext)
    return (
        <Chart
            height={height}
            chartType="ColumnChart"
            loader={<div style={{ width: '357px', height: height}} />}
            data={data}
            options={{
                legend: { position: 'none' },
                enableInteractivity: enableInteractivity,
                backgroundColor: theme.darkMode ? '#121212' : '#eee',
                hAxis: {
                    textStyle: { color: '#555' }
                },
                vAxis: {
                    baselineColor: theme.darkMode ? '#121212' : '#eee',
                    gridlineColor: theme.darkMode ? '#121212' : '#eee',
                    textPosition: 'none',
                }
            }}
            chartEvents={chartEvents}
        />
    )
}

export default BarGraph
