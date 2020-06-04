import React from 'react';
import AuthNavbar from 'components/Navbars/AuthNavbar.js';
import AuthFooter from 'components/Footers/AuthFooter.js';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Alert from '../../components/Alert';
import { verifyEmail } from '../../actions/authActions';
// reactstrap components
import { Container, Row, Col } from 'reactstrap';

class EmailVerification extends React.Component {
  constructor() {
    super();
    this.state = {
      token: '',
    };
  }

  componentDidMount() {
    document.body.classList.add('bg-default');
    this.setState({ token: this.props.match.params.token });
    this.props.verifyEmail(this.props.match.params.token, this.props.history);
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
                    <h1 className='text-white'>Email Verification</h1>
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
          <div className='text-center'>
            <Col lg='5' md='7'></Col>
          </div>
        </div>
        <AuthFooter />
      </>
    );
  }
}

EmailVerification.propTypes = {
  verifyEmail: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { verifyEmail })(EmailVerification);
