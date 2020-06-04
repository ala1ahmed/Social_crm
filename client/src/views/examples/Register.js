import React from 'react';
import AuthNavbar from 'components/Navbars/AuthNavbar.js';
import AuthFooter from 'components/Footers/AuthFooter.js';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerCompany } from '../../actions/authActions';
import { setAlert } from '../../actions/alertActions';
import Alert from '../../components/Alert';
import {
  Container,
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from 'reactstrap';

class Register extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      password: '',
      password2: '',
      errors: {},
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    document.body.classList.add('bg-default');
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/');
    }
  }
  componentWillUnmount() {
    document.body.classList.remove('bg-default');
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    if (this.state.password !== this.state.password2) {
      this.props.setAlert('Passwords do not match', 'danger');
    } else if (this.state.password.length < 8) {
      this.props.setAlert('Passowrd length need to be more than 8', 'danger');
    } else {
      const newUser = {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
        password2: this.state.password2,
      };

      this.props.registerCompany(newUser, this.props.history);
    }
  }

  render() {
    return (
      <>
        <div className='main-content'>
          <AuthNavbar />
          <div className='header bg-gradient-info py-7 py-lg-8'>
            <Container>
              <div className='header-body text-center mb-7'>
                <Row className='justify-content-center'>
                  <Col lg='5' md='6'>
                    <h1 className='text-white'>Register!</h1>
                  </Col>
                </Row>
              </div>
            </Container>
            <div className='separator separator-bottom separator-skew zindex-100'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                preserveAspectRatio='none'
                version='1.1'
                viewBox='0 0 2560 100'
                x='0'
                y='0'
              >
                <polygon
                  className='fill-default'
                  points='2560 0 2560 100 0 100'
                />
              </svg>
            </div>
          </div>
          <Alert></Alert>
          <Row className='justify-content-md-center'>
            <Col lg='6' md='8'>
              <Card className='bg-secondary shadow border-0'>
                <CardHeader className='bg-transparent pb-5'>
                  <div className='text-muted text-center mt-2 mb-4'>
                    <small>Sign up as</small>
                  </div>
                  <div className='text-center'>
                    <Button
                      className='btn-neutral btn-icon mr-4'
                      color='default'
                      href='/register'
                    >
                      <span className='btn-inner--icon'></span>
                      <span className='btn-inner--text'>Company</span>
                    </Button>
                    <Button
                      className='btn-neutral btn-icon'
                      color='default'
                      href='/community-manager/register'
                    >
                      <span className='btn-inner--icon'></span>
                      <span className='btn-inner--text'>Community Manager</span>
                    </Button>
                  </div>
                </CardHeader>

                <CardBody className='px-lg-5 py-lg-5'>
                  <div className='text-center text-muted mb-4'>
                    <small> Sign up as Company</small>
                  </div>
                  <Form role='form' onSubmit={this.onSubmit}>
                    <FormGroup>
                      <InputGroup className='input-group-alternative mb-3'>
                        <InputGroupAddon addonType='prepend'>
                          <InputGroupText>
                            <i className='ni ni-hat-3' />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder='Name'
                          type='text'
                          name='name'
                          value={this.state.name}
                          onChange={this.onChange}
                        />
                      </InputGroup>
                    </FormGroup>
                    <FormGroup>
                      <InputGroup className='input-group-alternative mb-3'>
                        <InputGroupAddon addonType='prepend'>
                          <InputGroupText>
                            <i className='ni ni-email-83' />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder='Email'
                          type='email'
                          name='email'
                          autoComplete='new-email'
                          value={this.state.email}
                          onChange={this.onChange}
                        />
                      </InputGroup>
                    </FormGroup>
                    <FormGroup>
                      <InputGroup className='input-group-alternative mb-3'>
                        <InputGroupAddon addonType='prepend'>
                          <InputGroupText>
                            <i className='ni ni-key-25' />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder='Password'
                          type='password'
                          name='password'
                          value={this.state.password}
                          onChange={this.onChange}
                        />
                      </InputGroup>
                    </FormGroup>

                    <FormGroup>
                      <InputGroup className='input-group-alternative mb-3'>
                        <InputGroupAddon addonType='prepend'>
                          <InputGroupText>
                            <i className='ni ni-key-25' />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder='Confirme password'
                          type='password'
                          value={this.state.password2}
                          name='password2'
                          onChange={this.onChange}
                        />
                      </InputGroup>
                    </FormGroup>

                    <div className='text-center'>
                      <input
                        value='Create account'
                        type='submit'
                        className='btn btn-info btn-block mt-4'
                      />
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
        <AuthFooter />
      </>
    );
  }
}

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  registerCompany: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { registerCompany, setAlert })(
  withRouter(Register)
);
