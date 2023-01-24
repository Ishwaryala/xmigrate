import React, { Component } from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import Tags from "@yaireo/tagify/dist/react.tagify.js";
import "./Discover.scss"
import PostService from '../../services/PostService';
import { GetServiceWithData } from '../../services/GetService';
import { DISCOVERURL, STREAMURL } from '../../services/Services';
import { Link } from 'react-router-dom';
import "@yaireo/tagify/dist/tagify.css"

export default class Discover extends Component {


    constructor(props) {
        super()
        console.log("PROPs", props);
        this.state = {
            showDiscoverMenu: true,
            showDiscoverMenuEdit: false,
            tags: [],
            email: "",
            password: "",
            provider: props.CurrentPro.provider,
            project: props.CurrentPro.name,
            message: "",
            disableGoToBlueprint: true,
            streamming: false,
            parsedTags: []
        };
        const settings = {};
        this.messagesEndRef = React.createRef();
        this.onChange = this.onChange.bind(this)
        this.editDiscover = this.editDiscover.bind(this)
        this.getStream = this.getStream.bind(this)
    }

    onChange(e) {
        // e.persist()
        console.log("detailtagify", e.detail.tagify.value);
        console.log("CHANGED:", e.detail.tagify.DOM.originalInput);
        console.log("detailtagify", e.detail.tagify.value);
        console.log("detailvalue", e.detail.value)
        try {
            var parsed = JSON.parse(e.detail.value).map((data) => data.value)
            console.log(parsed);
            this.setState({ tags: e.detail.value, parsedTags: parsed })
        }
        catch (e) {
            console.log("Here");
        }
    }



    setUsername(e) {
        this.setState({ username: e.target.value })
    }
    setPassword(e) {
        this.setState({ password: e.target.value })
    }
    editDiscover() {
        if (this.state.streamming) {
            alert("data processing...");
        } else {
            this.setState({
                showDiscoverMenu: true,
                showDiscoverMenuEdit: false,
            })
        }

    }

    submitDiscover() {
        var hosts = []
        JSON.parse(this.state.tags).map((data) => hosts.push(data.value))
        console.log(hosts);
        var data = {
            "hosts": hosts,
            "username": this.state.username,
            "password": this.state.password,
            "provider": this.state.provider,
            "project": this.state.project
        }
        PostService(DISCOVERURL, data).then((data) => {
            console.log(data)
            var intervalId = setInterval(this.getStream, 3000);
            this.setState({ intervalId: intervalId, streamming: true, showDiscoverMenu: false, showDiscoverMenuEdit: true });
        })
    }
    scrollToBottom = () => {
        this.messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
    getStream() {
        var data = {
            "project": this.state.project
        }
        GetServiceWithData(STREAMURL, data).then((data) => {
            this.scrollToBottom();
            console.log(data);
            if (data.data.offset === "EOF") {
                clearInterval(this.state.intervalId);
                this.setState({
                    streamming: false
                })
            }
            if (data.data.blueprint_status === "success") {
                this.setState({
                    disableGoToBlueprint: false,
                    streamming: false
                })
            }

            this.setState({
                message: data.data.line
            })
        })
    }
    render() {

        return (
            <div className="Discover media-body background-primary ">
                <Container className="py-5 containterDiscover">
                    <h4 className="p-0 m-0 HeadingPage">
                        Add IP’s of your servers to be migrated
                    </h4>

                    <Row className="py-5 ">
                        <Col md={{ span: 4 }} className="bg-white shadow-sm rounded ">
                            <div className="m-3 d-flex flex-column justify-content-between h-100">

                                <div id="discover-menu" className={` ${this.state.showDiscoverMenu ? "" : "d-none"} `}>

                                    <h5 >
                                        Server IP's
                                    </h5>

                                    {/* <input type="textarea" name="" id="" /> */}
                                    {/* <Tags mode='textarea' settings={this.settings}  onChange={this.onChange}  />/ */}
                                    <Tags className="mb-3" mode='textarea' onChange={this.onChange} />
                                    <Form className="mb-3">
                                        <Form.Group className="mb-3" controlId="formBasicEmail" onChange={this.setUsername.bind(this)}>
                                            <Form.Label>Username</Form.Label>
                                            <Form.Control type="text" placeholder="User should have sudo access" />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="formBasicPassword" onChange={this.setPassword.bind(this)}>
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control type="password" placeholder="Enter the password to be used" />
                                        </Form.Group>
                                        <Button variant="primary" type="button" className="w-100" onClick={this.submitDiscover.bind(this)}>
                                            Submit
                                        </Button>
                                    </Form>
                                </div>

                                <div id="discover-menu-edit" className={` ${this.state.showDiscoverMenuEdit ? "" : "d-none"} `}>
                                    <h5>
                                        Server IP's
                                    </h5>
                                    <div className="pt-4">
                                        {this.state.parsedTags.map((data, index) =>
                                            <Button variant="success" key={index} type="button" disabled className="w-100">
                                                {data}
                                            </Button>
                                        )}


                                        <p className=" text-center pt-3">
                                            <span className={` ${this.state.streamming ? "d-none" : "btn text-primary"} `} onClick={this.editDiscover}> <u> Edit Discovery</u>  </span>
                                        </p>
                                    </div>

                                </div>
                            </div>
                        </Col>
                        <Col md={{ span: 8 }} className="p-0 clrg">
                            <div className="shadow-sm   ml-5 rounded bg-white d-flex flex-column clrg ">
                                <div className="p-3 d-flex justify-content-between">
                                    <span>
                                        {this.state.disableGoToBlueprint ?
                                            this.state.streamming ? "Gathering Informations" : "Discover"
                                            : "Done"
                                        }

                                    </span>
                                    {this.state.disableGoToBlueprint ?
                                        this.state.streamming ?
                                            <Button variant="secondary" disabled>
                                                Go to Blueprint
                                            </Button>
                                            :
                                            <Button variant="secondary" disabled>
                                                Discover
                                            </Button>
                                        :
                                        <Link to="/home/blue-print">
                                            <Button variant="success" >
                                                Go to Blueprint
                                            </Button>
                                        </Link>
                                    }
                                </div>
                                <div className="background-primary media-body p-3 discover-logs" >
                                    {this.state.message}
                                    <div ref={this.messagesEndRef}></div>
                                </div>
                            </div>
                        </Col>
                    </Row>

                </Container>
            </div>
        )
    }
}
