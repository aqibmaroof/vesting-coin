import { Card, Col } from "react-bootstrap";
import './Card.module.scss';


interface cardValue {
  Title: String
  Subtitle?: any
  children?: JSX.Element | JSX.Element[];
}
export default function Cards({ Title, Subtitle, children }: cardValue) {
  return (
    <Col className='card-col px-0' md={4} sm={5} xs={11}>
      <Card>
        <Card.Body>
          <Card.Title className="heading-4">{Title}</Card.Title>
          <Card.Subtitle className="heading-2">
            {Subtitle ? Subtitle : ""}
            {children}
          </Card.Subtitle>
        </Card.Body>
        <Card.Footer className="xetaBottomTxt"> XETA </Card.Footer>
      </Card>
    </Col>
  );
}
