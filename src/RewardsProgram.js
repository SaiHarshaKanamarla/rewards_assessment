import {useState, useEffect} from 'react';
import axios from 'axios';

function calculateRewardPoints(transactionAmount) {
    let points = 0;
    if (transactionAmount > 100) {
        // two points for each dollar for more than $100 spent
      points += (transactionAmount - 100) * 2;
      transactionAmount = transactionAmount - points/2
    }
    if (transactionAmount > 50) {
        // one point for each dollar spent between $50 and $100
        points += (transactionAmount - 50);
        }
    return points;
  }

const RewardsProgram = () => {
    const [transactionData, setTransactionData] = useState([]);
    // const [monthlyPoints, setMonthlyPoints] = useState([]);
    
    let totalPoints = {};
    let monthlyPoints = {}
    for (const transaction of transactionData) {
        // This block of code is to calculate total reward points earned for each customer
        const { customerId, transactionAmount, transactionDate } = transaction;
        const points = calculateRewardPoints(transactionAmount);
        if (!totalPoints[customerId]) {
        totalPoints[customerId] = 0;
        }
        totalPoints[customerId] += points;

         //This block is to calculate total reward points earned by each customer each month
        const transactionMonth = new Date(transactionDate).getMonth();
        const monthlyKey = `${customerId}-${transactionMonth}`;
        if (!monthlyPoints[monthlyKey]) {
        monthlyPoints[monthlyKey] = 0;
        }
        monthlyPoints[monthlyKey] += points;
    }

   

    useEffect(() => {
        const getTransactions = async () => {
            const response = await axios.get('http://localhost:3000/transactions')
            setTransactionData(response.data)
        }

        getTransactions();
    }, [])


    return(
        <div>
            <h2>Total Reward Points for each Customer</h2>
            <ul>
                {Object.entries(totalPoints).map(([customerId, points]) => (
                    <li key={customerId}>
                        Customer {customerId}: {points} points
                    </li>
                ))}
            </ul>

            <h2>Monthly Reward Points for Customer</h2>
            <ul>
                {Object.entries(monthlyPoints).map(([monthlyKey, points]) => {
                const [customerId, month] = monthlyKey.split('-');
                const monthName = new Date(2022, month).toLocaleString('default', { month: 'long' });
                return (
                    <li key={monthlyKey}>
                    Customer {customerId} - {monthName}: {points} points
                    </li>
                );
                })}
            </ul>
            
        </div>
    )
}

export default RewardsProgram;