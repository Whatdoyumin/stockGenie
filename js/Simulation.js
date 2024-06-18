let initialCapital = 0;
let transactions = [];

document.getElementById('setInitialCapitalButton').addEventListener('click', function() {
    initialCapital = parseFloat(document.getElementById('initialCapitalInput').value);
    if (!isNaN(initialCapital)) {
        document.getElementById('initialCapitalInput').disabled = true;
        document.getElementById('setInitialCapitalButton').disabled = true;

        document.getElementById('addTransactionButton').style.display = 'block';
        document.getElementById('resultButton').style.display = 'block';

        addTransaction();
    } else {
        alert('초기 자금액을 정확히 입력해주세요.');
    }
});

document.getElementById('addTransactionButton').addEventListener('click', function() {
    addTransaction();
});

document.getElementById('resultButton').addEventListener('click', function() {
    calculateFinalResult();
});

function addTransaction() {
    const transactionsDiv = document.getElementById('transactions');

    const transactionDiv = document.createElement('div');
    transactionDiv.classList.add('transaction');
    transactionDiv.innerHTML = `
        <div class="addedBox">
            <div class="inputContainer">
                <label for="stockInput">종목명 :</label>
                <input type="text" placeholder="e.g., 삼성전자" class="stockInput">
            </div>
            <div class="inputContainer">
                <label>매수일  :</label>
                <input type="text" placeholder="e.g., 20240529" class="dateOfPurchaseInput">
                <button class="fetchPurchasePriceButton">종가 확인</button>
            </div>
            <div class="inputContainer">
                <span class="purchasePriceDisplay"></span>
            </div>
            <div class="inputContainer">    
                <label>매도할 주 수:</label>
                <input type="number" class="numberOfSharesInput" placeholder="숫자를 입력하세요.">
            </div>
            <div class="inputContainer">    
                <label>매도일 :</label>
                <input type="text" placeholder="e.g., 20240607" class="dateOfSaleInput">
            </div>
            <div>   
                <button class="calculateProfitButton">수익률 계산</button>
                <div class="errorMessage" style="color: red;"></div>
            <div>
        </div>
    `;

    transactionsDiv.appendChild(transactionDiv);
    attachEventListeners(transactionDiv);
}

function attachEventListeners(transactionDiv) {
    const fetchPurchasePriceButton = transactionDiv.querySelector('.fetchPurchasePriceButton');
    fetchPurchasePriceButton.addEventListener('click', function() {
        fetchPurchasePrice(transactionDiv);
    });

    const calculateProfitButton = transactionDiv.querySelector('.calculateProfitButton');
    calculateProfitButton.addEventListener('click', function() {
        calculateProfit(transactionDiv);
    });
}

function fetchPurchasePrice(transactionDiv) {
    const stockName = transactionDiv.querySelector('.stockInput').value;
    const dateOfPurchase = transactionDiv.querySelector('.dateOfPurchaseInput').value;
    const url = 'https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService/getStockPriceInfo';
    const params = {
        serviceKey: 'nA4X9d304NMyHczzAMrgbKulaL/jdmqOPethchUpu41LKwrrR+Rg4fsY1zqZK0hZqzqWILwt9PlVj3xOJpskIw==',
        numOfRows: 1,
        pageNo: 1,
        resultType: 'json',
        itmsNm: stockName,
        basDt: dateOfPurchase
    };

    axios.get(url, { params })
        .then(response => {
            const data = response.data;
            const purchasePriceDisplay = transactionDiv.querySelector('.purchasePriceDisplay');

            if (data.response && data.response.body && data.response.body.items && data.response.body.items.item) {
                const purchaseItem = data.response.body.items.item[0];
                const purchasePrice = purchaseItem ? parseFloat(purchaseItem.clpr) : NaN;
                if (!isNaN(purchasePrice)) {
                    purchasePriceDisplay.textContent = `매수일(${dateOfPurchase}) 종가: ${purchasePrice.toFixed(2)}`;
                } else {
                    purchasePriceDisplay.textContent = '매수일 데이터를 찾을 수 없음';
                }
            } else {
                purchasePriceDisplay.textContent = '매수일 데이터를 찾을 수 없음';
            }
        })
        .catch(error => {
            let errorMessage = '';
            if (error.response) {
                errorMessage = `HTTP 요청 오류가 발생했습니다: ${error.response.status} - ${error.response.statusText}`;
            } else if (error.request) {
                errorMessage = '응답을 받지 못했습니다: ' + error.request;
            } else {
                errorMessage = '요청 설정 중 오류가 발생했습니다: ' + error.message;
            }
            transactionDiv.querySelector('.errorMessage').textContent = errorMessage;
        });
}

function calculateProfit(transactionDiv) {
    const stockName = transactionDiv.querySelector('.stockInput').value;
    const numberOfShares = parseInt(transactionDiv.querySelector('.numberOfSharesInput').value);
    const dateOfPurchase = transactionDiv.querySelector('.dateOfPurchaseInput').value;
    const dateOfSale = transactionDiv.querySelector('.dateOfSaleInput').value;
    const errorMessageDiv = transactionDiv.querySelector('.errorMessage');
    errorMessageDiv.textContent = ''; // Clear any previous error message

    const url = 'https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService/getStockPriceInfo';
    const paramsPurchase = {
        serviceKey: 'nA4X9d304NMyHczzAMrgbKulaL/jdmqOPethchUpu41LKwrrR+Rg4fsY1zqZK0hZqzqWILwt9PlVj3xOJpskIw==',
        numOfRows: 1,
        pageNo: 1,
        resultType: 'json',
        itmsNm: stockName,
        basDt: dateOfPurchase
    };

    axios.get(url, { params: paramsPurchase })
        .then(response => {
            const dataPurchase = response.data;

            let purchasePrice = 0;
            if (dataPurchase.response && dataPurchase.response.body && dataPurchase.response.body.items && dataPurchase.response.body.items.item) {
                const purchaseItem = dataPurchase.response.body.items.item[0];
                purchasePrice = purchaseItem ? parseFloat(purchaseItem.clpr) : NaN;
            } else {
                errorMessageDiv.textContent = '매수일 데이터를 찾을 수 없음';
                return;
            }

            const totalCost = purchasePrice * numberOfShares;
            if (totalCost > initialCapital) {
                errorMessageDiv.textContent = '매수 비용이 자본을 초과합니다. 다시 입력해주세요.';
                return;
            }

            const paramsSale = {
                serviceKey: 'nA4X9d304NMyHczzAMrgbKulaL/jdmqOPethchUpu41LKwrrR+Rg4fsY1zqZK0hZqzqWILwt9PlVj3xOJpskIw==',
                numOfRows: 1,
                pageNo: 1,
                resultType: 'json',
                itmsNm: stockName,
                basDt: dateOfSale
            };

            axios.get(url, { params: paramsSale })
                .then(response => {
                    const dataSale = response.data;

                    let salePrice = 0;
                    if (dataSale.response && dataSale.response.body && dataSale.response.body.items && dataSale.response.body.items.item) {
                        const saleItem = dataSale.response.body.items.item[0];
                        salePrice = saleItem ? parseFloat(saleItem.clpr) : NaN;
                    } else {
                        errorMessageDiv.textContent = '매도일 데이터를 찾을 수 없음';
                        return;
                    }

                    if (!isNaN(numberOfShares) && !isNaN(purchasePrice) && !isNaN(salePrice) && purchasePrice !== 0) {
                        const totalCost = purchasePrice * numberOfShares;
                        const profit = (salePrice * numberOfShares) - totalCost;
                        const profitPercentage = (profit / totalCost) * 100;
                        const initialCapitalBeforeTransaction = initialCapital;

                        initialCapital += profit;

                        transactions.push({
                            stockName,
                            purchasePrice,
                            salePrice,
                            numberOfShares,
                            profit,
                            profitPercentage
                        });

                        const resultElement = document.createElement('div');
                        resultElement.classList.add('result');

                        const capitalElement = document.createElement('div');
                        capitalElement.textContent = `자금: ${initialCapitalBeforeTransaction.toFixed(0)}원`;
                        resultElement.appendChild(capitalElement);

                        const purchasePriceElement = document.createElement('div');
                        purchasePriceElement.textContent = `매수 일(${dateOfPurchase}) 종가: ${purchasePrice.toFixed(0)}원`;
                        resultElement.appendChild(purchasePriceElement);

                        const numberOfSharesElement = document.createElement('div');
                        numberOfSharesElement.textContent = `매수 주식 수: ${numberOfShares}주`;
                        resultElement.appendChild(numberOfSharesElement);

                        const salePriceElement = document.createElement('div');
                        salePriceElement.textContent = `매도 일(${dateOfSale}) 종가: ${salePrice.toFixed(0)}원`;
                        resultElement.appendChild(salePriceElement);

                        const profitElement = document.createElement('div');
                        profitElement.textContent = `수익: ${profit.toFixed(0)}원`;
                        resultElement.appendChild(profitElement);

                        const profitPercentageElement = document.createElement('div');
                        profitPercentageElement.textContent = `수익률: ${profitPercentage.toFixed(2)}%`;
                        resultElement.appendChild(profitPercentageElement);

                        const finalCapitalElement = document.createElement('div');
                        finalCapitalElement.textContent = `최종 자금: ${initialCapital.toFixed(0)}원`;
                        resultElement.appendChild(finalCapitalElement);

                        const addResultDiv = document.querySelector('.sideResultContainer .addResult');
                        addResultDiv.appendChild(resultElement);
                    } else {
                        errorMessageDiv.textContent = '올바른 값을 입력해주세요.';
                    }
                })
                .catch(error => {
                    let errorMessage = '';
                    if (error.response) {
                        errorMessage = `HTTP 요청 오류가 발생했습니다: ${error.response.status} - ${error.response.statusText}`;
                    } else if (error.request) {
                        errorMessage = '응답을 받지 못했습니다: ' + error.request;
                    } else {
                        errorMessage = '요청 설정 중 오류가 발생했습니다: ' + error.message;
                    }
                    errorMessageDiv.textContent = errorMessage;
                });
        })
        .catch(error => {
            let errorMessage = '';
            if (error.response) {
                errorMessage = `HTTP 요청 오류가 발생했습니다: ${error.response.status} - ${error.response.statusText}`;
            } else if (error.request) {
                errorMessage = '응답을 받지 못했습니다: ' + error.request;
            } else {
                errorMessage = '요청 설정 중 오류가 발생했습니다: ' + error.message;
            }
            errorMessageDiv.textContent = errorMessage;
        });
}

function calculateFinalResult() {
    const finalResultElement = document.getElementById('finalResult');
    const stockProfits = {};
    let totalProfit = 0;

    transactions.forEach(transaction => {
        if (!stockProfits[transaction.stockName]) {
            stockProfits[transaction.stockName] = {
                totalProfit: 0,
                totalInvestment: 0
            };
        }
        stockProfits[transaction.stockName].totalProfit += transaction.profit;
        stockProfits[transaction.stockName].totalInvestment += transaction.purchasePrice * transaction.numberOfShares;
        totalProfit += transaction.profit;
    });

    let resultText = '종목 별 수익률:\n';
    for (const stockName in stockProfits) {
        const stock = stockProfits[stockName];
        const profitPercentage = (stock.totalProfit / stock.totalInvestment) * 100;
        resultText += `${stockName}: ${profitPercentage.toFixed(2)}%\n`;
    }

    const finalProfitPercentage = (totalProfit / (initialCapital - totalProfit)) * 100;
    resultText += `\n최종 수익률: ${finalProfitPercentage.toFixed(2)}%\n`;
    resultText += `최종 자금: ${initialCapital.toFixed(2)}`;

    finalResultElement.textContent = resultText;
}