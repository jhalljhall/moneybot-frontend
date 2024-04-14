export default function authHeader() {
    let header_obj = {
      'Content-Type': 'application/json'
    }
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.access) {
      header_obj["Authorization"] = 'Bearer ' + user.access;
      return header_obj;
    } else {
      return header_obj;
    }
  }