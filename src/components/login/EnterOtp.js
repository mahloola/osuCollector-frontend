import { Card, Container, FormControl } from '../bootstrap-osu-collector'
import md5 from 'md5'
import PropTypes from 'prop-types'
import * as api from '../../utils/api'
import { useHistory } from 'react-router-dom'

function EnterOtp({ authX, setUser }) {
    const history = useHistory();

    const onOtpChanged = async (event) => {
        const inputString = event.target.value
        if (inputString.length == 0 || inputString.length > 4) {
            console.log('inputString: ' + inputString)
            return
        }

        const otp = Number(inputString)
        if (isNaN(otp) || !otp) {
            console.log('otp: ' + otp)
            return
        }

        const y = md5(authX)
        console.log('otp: ' + otp)
        console.log('x: ' + authX)
        console.log('y: ' + y)

        // Submit 
        const res = await api.submitOtp(otp, y)
        console.log(res.status)
        if (res.status === 200) {
            console.log('Logged in!')
            // Get user
            const user = await api.getOwnUser();
            setUser(user);
            history.push('/')
        } else if (res.status === 440) {
            alert('Login expired, please try to log in again.')
            console.log('Login expired, please try to log in again.')
            history.push('/')
        } else {
            console.log('OTP auth failed.')
        }
    }

    return (
        <Container className='pt-4'>
            <Card className='px-4 py-5 my-5 text-center'>
                <h1 className='display-5 fw-bold'>One time password</h1>
                <div className='mx-auto'>
                    <p className='lead mb-4'>After authenticating through the osu! website, osu!Collector should show you a one time password.<br />
                        Please enter it here to finish logging in.</p>
                </div>
                <FormControl
                    className='col-1 mx-auto'
                    type='text'
                    size='lg'
                    style={{ textAlign: 'center' }}
                    placeholder='1234'
                    onChange={onOtpChanged}
                />
            </Card>
        </Container>
    )
}

EnterOtp.propTypes = {
    authX: PropTypes.string
}

export default EnterOtp
