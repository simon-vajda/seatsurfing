import React from 'react';
import { Nav, Button, Form } from 'react-bootstrap';
import './NavBar.css';
import { Link, Navigate } from 'react-router-dom';
import { Ajax, AjaxCredentials } from 'flexspace-commons';
import { withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

interface State {
    search: string
    redirect: string | null
}

interface Props {
    t: TFunction
}

class NavBar extends React.Component<Props, State> {
    constructor(props: any) {
        super(props);
        this.state = {
            search: "",
            redirect: null
        };
    }

    logout = (e: any) => {
        e.preventDefault();
        Ajax.CREDENTIALS = new AjaxCredentials();
        Ajax.PERSISTER.deleteCredentialsFromSessionStorage().then(() => {
            this.setState({
                redirect: "/login"
            });
        });
    }

    submitSearchForm = (e: any) => {
        e.preventDefault();
        window.sessionStorage.setItem("searchKeyword", this.state.search);
        this.setState({
            redirect: "/search/" + window.encodeURIComponent(this.state.search)
        });
    }

    componentDidMount = () => {
        let isSearchPage = (window.location.href.indexOf("/admin/search/") > -1);
        let keyword = window.sessionStorage.getItem("searchKeyword");
        if (isSearchPage && keyword) {
            this.setState({ search: keyword });
        } else {
            window.sessionStorage.removeItem("searchKeyword");
        }
    }

    render() {
        if (this.state.redirect != null) {
            let target = this.state.redirect;
            this.setState({ redirect: null });
            return <Navigate replace={true} to={target} />
        }

        return (
            <Nav className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
                <Link className="navbar-brand col-md-3 col-lg-2 mr-0 px-3" to="/dashboard"><img src="./seatsurfing_white.svg" alt="Seatsurfing" /></Link>
                <button className="navbar-toggler position-absolute d-md-none collapsed" type="button" data-toggle="collapse" data-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <Form onSubmit={this.submitSearchForm} className="w-100">
                    <Form.Control type="text" className="form-control form-control-dark w-100" placeholder={this.props.t("search")} aria-label="Suchen" value={this.state.search} onChange={(e: any) => this.setState({ search: e.target.value })} required={true} />
                </Form>
                <ul className="navbar-nav px-3">
                    <li className="nav-item text-nowrap">
                        <Button variant="link" className="nav-link" onClick={this.logout}> {this.props.t("logout")}</Button>
                    </li>
                </ul>
            </Nav>
        );
    }
}

export default withTranslation()(NavBar as any);
