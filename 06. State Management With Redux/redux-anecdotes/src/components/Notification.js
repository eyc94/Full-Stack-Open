import { connect } from "react-redux";

const Notification = (props) => {
    const notification = props.notification;
    const style = {
        border: "solid",
        padding: 10,
        borderWidth: 1
    };

    const noStyle = {
        display: "none"
    };

    return (
        <div style={notification.length < 1 ? noStyle : style}>
            {notification}
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        notification: state.notification
    };
};

export default connect(
    mapStateToProps
)(Notification);
