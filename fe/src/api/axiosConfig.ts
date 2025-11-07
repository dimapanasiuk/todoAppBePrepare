import axios from 'axios';

// Configure axios to send cookies with every request
axios.defaults.withCredentials = true;

export default axios;
