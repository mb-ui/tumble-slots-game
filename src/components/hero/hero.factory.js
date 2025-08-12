import pub_sub from '../../api/pub_sub';
import Hero from './hero';
export default Hero.bind(undefined, () => ({
    pub_sub,
}))