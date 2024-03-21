const whetherLogged = async () => {

    try {

        const response = await fetch('/checkAuth', {
            method: 'POST',
            headers: {
                    "x-access-token":localStorage.getItem('token')
            },
        });

        const whetherLoggedin = await response.json();

        if (whetherLoggedin.LoggedIn === true) {
            console.log("yes session is valid");
            return true;
        }
        else{
            console.log(whetherLoggedin);
            console.log("session is not valid");
            return false;
        }

    } catch (error) {
        console.log(error);
        return false;
    }

}

export { whetherLogged };

