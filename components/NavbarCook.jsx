import { Nav, Navbar, Container } from "react-bootstrap";

export default function NavbarComponentCook() {
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
                        <Navbar.Brand className="mx-auto">Cook</Navbar.Brand>
                        <Nav.Link href="/cook">Ingredient</Nav.Link>
                        <Nav.Link href="/cook/order">Order</Nav.Link>
                        <Nav.Link href="/cook/logout">Logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
