async function CallService(serviceName, data, onResponse, isAsync) {

    const servicePath = "http://localhost:5001/api/users/" + serviceName;
    const options = {
        method:"POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include'
    };

    const headerHandler = response => {if (response.ok) {return response.json();}};
    const dataHandler = data => {if (onResponse !== undefined) {onResponse(data)}};
    
    if (isAsync) {
        fetch(servicePath, options).then(headerHandler).then(dataHandler);
    }
    else {
        await fetch(servicePath, options).then(headerHandler).then(dataHandler);
    }

}

export default CallService;