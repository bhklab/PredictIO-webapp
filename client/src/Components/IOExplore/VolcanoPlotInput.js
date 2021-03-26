import React, {useState, useEffect} from 'react';
import axios from 'axios';
import StyledForm from '../UtilComponents/StyledForm';
import ActionButton from '../UtilComponents/ActionButton';
import CustomDropdown from '../UtilComponents/CustomDropdown';
import CustomMultiSelect from '../UtilComponents/CustomMultiSelect';

const VolcanoPlotInput = (props) => {

    const {parameters, setParameters, onSubmit, onReset, resetButton} = props;

    const [signatureOptions, setSignatureOptions] = useState([]);
    const [outcomeOptions, setOutcomeOptions] = useState([]);
    const [modelOptions, setModelOptions] = useState([]);

    const readyToSubmit = () => {
        return(
            parameters.model === '' ||
            parameters.outcome === '' ||
            parameters.subgroup === ''
        );
    };

    const onOutcomeSelect = (selected) => {
        let modelValue = '';
        let modelOptionsCopy = JSON.parse(JSON.stringify(modelOptions));

        if(selected.value !== 'Response'){
            modelOptionsCopy.find(item => item.value === 'Log_regression').isDisabled = true;
            modelOptionsCopy.filter(item => item.value !== 'Log_regression')
                .forEach(filtered => {
                    filtered.isDisabled = false;
                });
            modelValue = parameters.model === 'Log_regression' && '';
        }else{
            modelOptionsCopy.find(item => item.value === 'Log_regression').isDisabled = false;
            modelOptionsCopy.filter(item => item.value !== 'Log_regression')
                .forEach(filtered => {
                    filtered.isDisabled = true;
                });
            modelValue = parameters.model !== 'Log_regression' && '';
        }
        modelValue = selected.value === 'Response' ? 'Log_regression' : parameters.model === 'DI'?'DI':'COX';
        setModelOptions(modelOptionsCopy);

        setParameters(prev => ({
            ...prev,
            model: modelValue,
            outcome: selected.value
        }));
    }

    const onModelSelect = (selected) => {
        let outcomeValue = selected.value === 'Log_regression' ? 'Response' : parameters.outcome === 'PFS'?'PFS' : 'OS';

        setParameters(prev => ({
            ...prev,
            model: selected.value,
            outcome: outcomeValue
        }));
    }

    const onSignatureSelect = (selections) => {
        let signatureOptionsCopy = JSON.parse(JSON.stringify(signatureOptions));
        if(selections.value.includes('ALL')){
            signatureOptionsCopy.forEach(item => {
                if(item.value === 'ALL'){
                    item.disabled = false;
                }else{
                    item.disabled = true;
                }
            });
            selections.value = selections.value.filter(item => item === 'ALL');
        }else{
            signatureOptionsCopy.forEach(item => {
                item.disabled = false;
            });
        }

        setSignatureOptions(signatureOptionsCopy);
        setParameters({
            ...parameters,
            signatures: selections.value});
    }

    useEffect(() => {
        const setSelectOptions = async () => {
            const res = await axios.get('/api/dropdown_option/explore');
            console.log(res.data);
            let signatures = res.data.signatures.map(item => ({value: item, label: item, disabled: true}));
            signatures.unshift({value: 'ALL', label: 'ALL', disabled: false});
            setSignatureOptions(signatures);
            setOutcomeOptions(res.data.outcome.map(item => ({value: item, label: item, disabled: false})));
            setModelOptions(res.data.model.map(item => ({value: item, label: item, disabled: false})));
        }
        setSelectOptions();
    }, []);

    return(
        <StyledForm flexDirection={props.flexDirection}>
            <div className='formField'>
                <div className='label'>Outcome: </div>
                <CustomDropdown
                    className='select'
                    value={parameters.outcome}
                    options={outcomeOptions}
                    onChange={(e) => {onOutcomeSelect(e)}}
                    placeholder="Select..."
                />
            </div>
            <div className='formField'>
                <div className='label'>Model: </div>
                <CustomDropdown
                    className='select'
                    value={parameters.model}
                    options={modelOptions.filter(item => item.isDisabled !== true)}
                    onChange={(e) => {onModelSelect(e)}}
                    placeholder="Select..."
                />
            </div>
            <div className='formField'>
                <div className='label'>Signatures: </div>
                <CustomMultiSelect
                    className='select'
                    value={parameters.signatures}
                    options={signatureOptions}
                    onChange={(selections) => {onSignatureSelect(selections)}}
                    filter={true}
                    placeholder='Select...'
                />
            </div>
            <div className='formField buttonField'>
                <ActionButton
                    onClick={(e) => {onSubmit()}}
                    text='Submit'
                    disabled={readyToSubmit()}
                    style={{width: '90px', height: '34px', fontSize: '14px'}}
                />
                {
                    resetButton &&
                    <ActionButton
                        onClick={(e) => {onReset()}}
                        text='Reset'
                        type='reset'
                        style={{width: '90px', height: '34px', fontSize: '14px', marginLeft: '10px'}}
                    />
                }
            </div>
        </StyledForm>
    );
}

export default VolcanoPlotInput;