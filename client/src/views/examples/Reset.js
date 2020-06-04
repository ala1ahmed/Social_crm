import React from 'react';
import AuthNavbar from 'components/Navbars/AuthNavbar.js';
import AuthFooter from 'components/Footers/AuthFooter.js';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Alert from '../../components/Alert';
import { resetPassword } from '../../actions/authActions';
// reactstrap components
import {
  Container,
  Card,
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

class Reset extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
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
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push('/');
    }

    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    this.props.resetPassword(this.state.email);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
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
                    <h1 className='text-white'>Resestting password</h1>
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
            <Col lg='5' md='7'>
              <Card className='bg-secondary shadow border-0'>
                <CardBody className='px-lg-5 py-lg-5'>
                  <Form role='form' onSubmit={this.onSubmit}>
                    <FormGroup className='mb-3'>
                      <InputGroup className='input-group-alternative'>
                        <InputGroupAddon addonType='prepend'>
                          <InputGroupText>
                            <i className='ni ni-email-83' />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder='Email'
                          type='email'
                          name='email'
                          value={this.state.email}
                          onChange={this.onChange}
                          autoComplete='new-email'
                        />
                      </InputGroup>
                    </FormGroup>
                    <div className='text-center'>
                      <input
                        value='Reset'
                        type='submit'
                        className='btn btn-info btn-block mt-4'
                      />
                    </div>
                  </Form>
                </CardBody>
              </Card>

              <Row className='mt-3'>
                <Col xs='6'>
                  <a
                    className='text-light'
                    href='/reset'
                    onClick={(e) => e.preventDefault()}
                  >
                    <small>Forgot password?</small>
                  </a>
                </Col>
                <Col className='text-right' xs='6'>
                  <a className='text-light' href='/register'>
                    <small>Create new account</small>
                  </a>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <AuthFooter />
      </>
    );
  }
}

Reset.propTypes = {
  resetPassword: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { resetPassword })(Reset);
