import { Nav, Navbar, Container } from "react-bootstrap";

export default function NavbarComponentWaiter() {
    return (
        <Navbar
            expand="lg"
            bg="dark"
            data-bs-theme="dark"
            fixed="top"
            className="flex-column navbar-custom full-height d-flex justify-content-center"
        >
            <Container fluid>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav" className="w-100">
                    <Nav className="me-auto flex-column text-center">
                        <Navbar.Brand className="mx-auto">Waiter</Navbar.Brand>
                        <Nav.Link href="/waiter">Table</Nav.Link>
                        <Nav.Link href="/waiter/menu">Menu</Nav.Link>
                        <Nav.Link href="/waiter/cart">Cart</Nav.Link>
                        <Nav.Link href="/waiter/order">Order</Nav.Link>
                        <Nav.Link href="/waiter/payment">Payment</Nav.Link>
                        <Nav.Link href="/waiter/logout">Logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
