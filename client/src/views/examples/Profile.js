import React from 'react';
import AdminNavbar from 'components/Navbars/AdminNavbar.js';
import AdminFooter from 'components/Footers/AdminFooter.js';
import Sidebar from 'components/Sidebar/Sidebar.js';
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
} from 'reactstrap';
// core components
import UserHeader from 'components/Headers/UserHeader.js';
import routes from '../../routes.js';
class Profile extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      address: '',
      city: '',
      country: '',
      codePostal: '',
      facebookLink: '',
      twitterLink: '',
      linkedinLink: '',
      instagramLink: '',
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
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
        <Sidebar
          {...this.props}
          routes={routes}
          logo={{
            innerLink: '/',
            imgSrc: require('assets/img/brand/argon-react-white.png'),
            imgAlt: '...',
          }}
        />
        <div className='main-content' ref='mainContent'>
          <AdminNavbar {...this.props} brandText={'Socail CRM'} />
          <UserHeader />
          {/* Page content */}
          <Container className='mt--7' fluid>
            <Row>
              <Col className='order-xl-1' xl='12'>
                <Card className='bg-secondary shadow'>
                  <CardHeader className='bg-white border-0'>
                    <Row className='align-items-center'>
                      <Col xs='8'>
                        <h3 className='mb-0'>My account</h3>
                      </Col>
                      <Col className='text-right' xs='4'>
                        <Button
                          color='primary'
                          href='#pablo'
                          onClick={(e) => e.preventDefault()}
                          size='sm'
                        >
                          Settings
                        </Button>
                      </Col>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    <Form role='form' onSubmit={this.onSubmit}>
                      <h6 className='heading-small text-muted mb-4'>
                        User information
                      </h6>
                      <div className='pl-lg-4'>
                        <Row>
                          <Col lg='6'>
                            <FormGroup>
                              <label
                                className='form-control-label'
                                htmlFor='input-username'
                              >
                                Name
                              </label>
                              <Input
                                className='form-control-alternative'
                                value={this.state.name}
                                id='input-username'
                                placeholder='Name'
                                type='text'
                                name='name'
                                onChange={this.onChange}
                              />
                            </FormGroup>
                          </Col>
                          <Col lg='6'>
                            <FormGroup>
                              <label
                                className='form-control-label'
                                htmlFor='input-email'
                              >
                                Email
                              </label>
                              <Input
                                className='form-control-alternative'
                                id='input-email'
                                name='email'
                                onChange={this.onChange}
                                value={this.state.email}
                                placeholder='Email'
                                type='email'
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                      </div>
                      <hr className='my-4' />
                      {/* Address */}
                      <h6 className='heading-small text-muted mb-4'>
                        Contact information
                      </h6>
                      <div className='pl-lg-4'>
                        <Row>
                          <Col md='12'>
                            <FormGroup>
                              <label
                                className='form-control-label'
                                htmlFor='input-address'
                              >
                                Address
                              </label>
                              <Input
                                className='form-control-alternative'
                                defaultValue='Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09'
                                id='input-address'
                                placeholder='Home Address'
                                type='text'
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg='4'>
                            <FormGroup>
                              <label
                                className='form-control-label'
                                htmlFor='input-city'
                              >
                                City
                              </label>
                              <Input
                                className='form-control-alternative'
                                defaultValue='New York'
                                id='input-city'
                                placeholder='City'
                                type='text'
                              />
                            </FormGroup>
                          </Col>
                          <Col lg='4'>
                            <FormGroup>
                              <label
                                className='form-control-label'
                                htmlFor='input-country'
                              >
                                Country
                              </label>
                              <Input
                                className='form-control-alternative'
                                defaultValue='United States'
                                id='input-country'
                                placeholder='Country'
                                type='text'
                              />
                            </FormGroup>
                          </Col>
                          <Col lg='4'>
                            <FormGroup>
                              <label
                                className='form-control-label'
                                htmlFor='input-country'
                              >
                                Postal code
                              </label>
                              <Input
                                className='form-control-alternative'
                                id='input-postal-code'
                                placeholder='Postal code'
                                type='number'
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                      </div>
                      <hr className='my-4' />
                      {/* Description */}
                      <h6 className='heading-small text-muted mb-4'>
                        About me
                      </h6>
                      <div className='pl-lg-4'>
                        <FormGroup>
                          <label>About Me</label>
                          <Input
                            className='form-control-alternative'
                            placeholder='A few words about you ...'
                            rows='4'
                            defaultValue='A beautiful Dashboard for Bootstrap 4. It is Free and
                          Open Source.'
                            type='textarea'
                          />
                        </FormGroup>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
          <Container fluid>
            <AdminFooter />
          </Container>
        </div>
      </>
    );
  }
}

export default Profile;
