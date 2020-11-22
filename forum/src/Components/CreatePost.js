import React, { Component } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { Editor } from "@tinymce/tinymce-react";
import axios from 'axios';

var mongoose = require('mongoose');


//export default class CreatePost extends Component {
export default class CreatePost extends Component {
    constructor(props) {
        super(props);

        //method bindings
        this.onChangeText = this.onChangeText.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        //State object
        this.state = {
        parentid: 'testID',
        postnum: 0,
        authorid: 'testUserID',
        bodytext: '',
        delflag: false
      }
    }

    //Methods
    onChangeText(content, editor) {
        //alert("onChangeText: " + content);
        this.setState({
            bodytext: content
        })
    }

    //Function that submits data to db via axios and router
    onSubmit(e) {
    e.preventDefault();

    var newId = mongoose.Types.ObjectId();

    //Structure to be sent to axios/router
    const newPost = {
        parent_thread_id: newId,
        post_num: this.state.postnum,
        post_author: this.state.authorid,
        post_body_text: this.state.bodytext,
        del_flag: this.state.delflag
    }

    const newThread = {
        _id: newId,
        parent_topic_id: "testTopic",
        thread_num: 0,
        thread_author: "testAuthor",
        thread_title: "Thread_Title",
        del_flag: false
    }

    alert("new post json: " + newPost.del_flag + ", " + newPost.post_body_text);

    //axios sends data through backend API endpoint
    console.log(newPost);//console logging for dev - can be removed for release
    axios.post('http://localhost:5000/posts/add', newPost)
      .then(res => console.log(res.data));
    axios.post('http://localhost:5000/threads/add', newThread)
      .then(res => console.log(res.data));


  }
  

    //function CreatePost() {
    render() {
        return (
            <Container style={{ marginTop: "40px" }}>
                <Row>
                    <Col></Col>
                    <Col md={7} style={{ border: "5px solid black", borderRadius: "30px", padding: "20px 20px" }}>
                        <Form >
                            <Form.Group>
                                <Form.Label style={{ fontWeight: "bold" }}>New Post Name</Form.Label>
                                <Form.Control type="text" placeholder="Name" />
                                <Form.Text className="text-muted">
                                    What will your post be about?.
                                </Form.Text>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label style={{ fontWeight: "bold" }}>Post Body</Form.Label>
                                <Editor
                                    apiKey = "ryef7c7iynamh7xxtkti6mskmx80xg2t3qy2xqtiqmwxf2d5"
                                    init={{
                                        height: 300,
                                        menubar: false
                                    }}
                                    onEditorChange = {this.onChangeText}
                                />
                            </Form.Group>

                            <Form.Group>
                                <Row>
                                    <Col></Col>
                                    <Col style={{ textAlign: "center" }}>
                                        <Button onClick={this.onSubmit} 
                                            style={{ padding: "10px 20px", width: "160px" }} 
                                            variant="primary" 
                                            type="submit" 
                                            href="/posts/add">
                                            Create Post
                                        </Button>
                                    </Col>
                                    <Col></Col>
                                </Row>
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>
        );
    }
}