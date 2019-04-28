import React, { Component } from "react";
import { connect } from "react-redux";
import AttendanceStudent
    from "../components/attendanceReport/AttendanceStudent";
import { Form, Input, Label } from "reactstrap";

class DailyStandup extends Component{
    
    state = {
        students: null,
        loaded: false,
        module: "",
        wentWell: "",
        concerns: "",
        instructor: "",
        instructionRating: 3,
        instructorFeedback: "",
        flexTa: "",
        flexTaRating: 3,
        flexTaFeedback: "",
        other: ""
    };
    
    componentDidMount(){
        if( this.props.students && !this.state.loaded ){
            let keys = Object.keys( this.props.students );
            for( let i = 0; i < keys.length; i++ ){
                this.props.students[ keys[ i ] ].isPresent = true;
            }
            this.setState( {
                students: this.props.students, loaded: true,
            } );
        }
    }
    
    componentWillUpdate( nextProps, nextState, nextContext ){
        debugger;
        if( nextProps.students && !nextState.loaded ){
            
            let keys = Object.keys( nextProps.students );
            for( let i = 0; i < keys.length; i++ ){
                nextProps.students[ keys[ i ] ].isPresent = true;
            }
            this.setState( {
                students: nextProps.students, loaded: true,
            } );
        }
    }
    
    changePresent = id => {
        this.setState( state => {
            
            let student = { ...state.students[ id ] };
            student.isPresent = !state.students[ id ].isPresent;
            state.students[ id ] = student;
            return { students: { ...state.students } };
        } );
    };
    
    onChange = e => {
        this.setState( { [ e.target.name ]: e.target.value } );
    };
    
    getReportLink = () => {
        
        if( this.props.user ){
            let url = `https://airtable.com/shripCmauVlvxNrAT?prefill_Project+Manager=${ this.props.user.firstName }+${ this.props.user.lastName }+(${ this.props.user.cohort })&prefill_Sections=${ this.props.user.cohort }`;
            
            if( this.state.module !== "" ){
                url += `&prefill_Module=${ encodeURI( this.state.module ) }`;
            }
            
            if( this.state.students ){
                let afterFirst = false;
                let keys = Object.keys( this.state.students );
                let absentString = "&prefill_Students+(Absent)=";
                for( let i = 0; i < keys.length; i++ ){
                    if( !this.state.students[ keys[ i ] ].isPresent ){
                        if( afterFirst ){
                            absentString += ",";
                        }
                        absentString += `${ this.state.students[ keys[ i ] ].firstName.trim() }+${ this.state.students[ keys[ i ] ].lastName.trim() }`;
                        if( !afterFirst ){
                            afterFirst = true;
                        }
                    }
                }
                
                if( absentString !== "&prefill_Absent+Students=" ){
                    url += absentString;
                }
            }
            
            if( this.state.wentWell !== "" ){
                url += `&prefill_What+went+well=${ encodeURI( this.state.wentWell ) }`;
            }
            
            if( this.state.concerns !== "" ){
                url += `&prefill_Concerns=${ encodeURI( this.state.concerns ) }`;
            }
            
            if( this.state.instructor !== "" ){
                url += `&prefill_Instructor=${ encodeURI( this.state.instructor ) }`;
            }
            
            if( this.state.instructionRating ){
                url += `&prefill_Instruction+Rating=${ this.state.instructionRating }`;
            }
            
            if( this.state.instructorFeedback !== "" ){
                url += `&prefill_Instruction+Feedback=${ encodeURI( this.state.instructorFeedback ) }`;
            }
            
            if( this.state.flexTa !== "" ){
                url += `&prefill_Who+was+the+Flex+TA?=${ encodeURI( this.state.flexTa ) }`;
            }
            
            if( this.state.flexTaRating ){
                url += `&prefill_Flex+TA+Rating=${ this.state.flexTaRating }`;
            }
            
            if( this.state.flexTaFeedback !== "" ){
                url += `&prefill_Flex+TA+Feedback=${ encodeURI( this.state.flexTaFeedback ) }`;
            }
            
            if( this.state.other !== "" ){
                url += `&prefill_Other=${ encodeURI( this.state.other ) }`;
            }
            
            return url;
        }
        
    };
    
    render(){
        return ( <div>
            { this.state.students &&
            Object.values( this.state.students ).map( student => {
                return <AttendanceStudent lastName={ student.lastName }
                                          firstName={ student.firstName }
                                          id={ student.id }
                                          onChange={ this.changePresent }
                                          present={ student.isPresent }/>;
            } ) }
            
            <Form>
                <Input type={ "text" } value={ this.state.module }
                       placeHolder={ "What did your students study today?" }
                       onChange={ this.onChange }
                       name={ "module" }
                />
                <Input type={ "textarea" } value={ this.state.wentWell }
                       placeHolder={ "What went well today?" }
                       onChange={ this.onChange }
                       name={ "wentWell" }
                />
                <Input type={ "textarea" } value={ this.state.concerns }
                       placeHolder={ "What could have gone better and how will you help?" }
                       onChange={ this.onChange }
                       name={ "concerns" }
                />
                <Input type={ "text" } value={ this.state.instructor }
                       placeHolder={ "Who taught today?" }
                       onChange={ this.onChange }
                       name={ "instructor" }
                />
                <Label for={ "instructionRating" }>How would you rate the
                    instructor?</Label>
                <p>
                    <ul>
                        <li>1 - Did not meet expectations</li>
                        <li>2 - Met expectations</li>
                        <li>3 - Exceeded expectations</li>
                    </ul>
                </p>
                <Input id={ "instructionRating" } type={ "select" }
                       name={ "instructionRating" }
                       value={ this.state.instructionRating }
                       onChange={ this.onChange }
                >
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                </Input>
                <Input type={ "textarea" }
                       value={ this.state.instructorFeedback }
                       placeHolder={ "Any feedback for the instructor?" }
                       onChange={ this.onChange }
                       name={ "instructorFeedback" }
                />
                <Input type={ "text" } value={ this.state.flexTa }
                       placeHolder={ "Who was the flex TA?" }
                       onChange={ this.onChange }
                       name={ "flexTa" }
                />
                <Label for={ "flexTaRating" }>Flex Ta Guided Project
                    Rating</Label>
                <p>
                    <ul>
                        <li>1 - Did not meet expectations</li>
                        <li>2 - Met expectations</li>
                        <li>3 - Exceeded expectations</li>
                    </ul>
                </p>
                <Input id={ "flexTaRating" } type={ "select" }
                       value={ this.state.flexTaRating } name={ "flexTaRating" }
                       onChange={ this.onChange }>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                </Input>
                <Input type={ "text" } value={ this.state.flexTaFeedback }
                       placeHolder={ "Feedback for the Flex TA?" }
                       onChange={ this.onChange }
                       name={ "flexTaFeedback" }
                />
                <Input type={ "textArea" } value={ this.state.other }
                       placeHolder={ "Anything else we should know about?" }
                       onChange={ this.onChange }
                       name={ "other" }
                />
            </Form>
            <a className={ "attendance-link" }
               href={ this.getReportLink() }>{ this.getReportLink() }</a>
        </div> );
    }
}

const mpts = state => ( {
    students: state.students.students, user: state.auth.user
} );

export default connect( mpts )( DailyStandup );