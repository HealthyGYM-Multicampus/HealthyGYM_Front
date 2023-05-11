import { Button } from 'semantic-ui-react';

export default function SelectBodyPart(props) {
    
    const koBody = ["등", "가슴", "어깨", "팔", "복근", "하체", "유산소"];

    const changeButton = (index) => {
        props.setBodyPart((current) => {
            const newArr = [...current];
            newArr[index] = !newArr[index];
            return newArr;
        });
    };

    return (
        <div>
            {koBody.map((value, i) => {
                return (
                    <Button circular basic size='mini' key={i}
                        onClick={() => {changeButton(i)}}
                        className={props.bodyPart[i] ? "active":""}>
                        {value}
                    </Button>
                );
            })}
        </div>
    );
}