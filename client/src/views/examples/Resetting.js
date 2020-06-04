import React from 'react';
import AuthNavbar from 'components/Navbars/AuthNavbar.js';
import AuthFooter from 'components/Footers/AuthFooter.js';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { resettingPassword } from '../../actions/authActions';
import { setAlert } from '../../actions/alertActions';
import Alert from '../../components/Alert';
import {
  Container,
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

class Resetting extends React.Component {
  constructor() {
    super();
    this.state = {
      token: '',
      password: '',
      password2: '',
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    document.body.classList.add('bg-default');
    this.setState({ token: this.props.match.params.token });
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
        token: this.state.token,
        password: this.state.password,
      };

      this.props.resettingPassword(newUser, this.props.history);
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
                    <h1 className='text-white'>New Password!</h1>
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
                    <small>Enter your new Passowrd</small>
                  </div>
                </CardHeader>

                <CardBody className='px-lg-5 py-lg-5'>
                  <Form role='form' onSubmit={this.onSubmit}>
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
                        value='Reset Password'
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

Resetting.propTypes = {
  setAlert: PropTypes.func.isRequired,
  resettingPassword: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { resettingPassword, setAlert })(
  withRouter(Resetting)
);
