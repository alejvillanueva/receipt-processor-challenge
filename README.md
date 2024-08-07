# receipt-processor-challenge

## Instructions To Run and Test

1. Clone the github repo using the following command: <br/>
   `git clone git@github.com:alejvillanueva/receipt-processor-challenge.git`
2. In your terminal, navigate to the directory you just cloned.
3. Run the following commands to build and run the app:<br/>
   `docker build -t receipt-processor-app .` <br/>
   `docker run -p 3000:3000 receipt-processor-app`<br/>
   The app will be running on port 3000.
4. To send requests to the app, you can use curl commands in a separate terminal window, or use Postman.
