import React, { useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Spinner,
} from "react-bootstrap";

export default function PageNotFound() {
  return (
    <div className="pagenotfound">
      <h1>404</h1>
      <div className="content-type-01">
        <h5>OOPS! PAGE NOT FOUND</h5>
        <p>We've explored deep and wide,<br />
          but we can't find the page you were looking for.</p>
      </div>
      <button className="btn btn-primary" onClick={() => window.location.assign('/')}> Bak To Home Page</button>
    </div>

  );
}
