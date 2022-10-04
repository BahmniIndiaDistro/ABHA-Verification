import TimeAgo from "javascript-time-ago";
import en from 'javascript-time-ago/locale/en'

const Time = (props)=>{
    TimeAgo.addLocale(en)
    // Create a new instance
    const timeAgo = new TimeAgo('en');
    const inSeconds = new Date(props.time).getTime();
    const minutesAgo = timeAgo.format(inSeconds - 60 * 1000);

    return(
        <p>{minutesAgo}</p>
    )

}

export default Time;