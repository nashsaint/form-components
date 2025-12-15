import CAmount from './components/forms/CAmount.vue'
import CCheckbox from './components/forms/CCheckbox.vue'
import CConsent from './components/forms/CConsent.vue'
import CDatePicker from './components/forms/CDatePicker.vue'
import CDateRangePicker from './components/forms/CDateRangePicker.vue'
import CDropdown from './components/forms/CDropdown.vue'
import CFile from './components/forms/CFile.vue'
import CInput from './components/forms/CInput.vue'
import CNumber from './components/forms/CNumber.vue'
import CTagInput from './components/forms/CTagInput.vue'
import CTextarea from './components/forms/CTextarea.vue'
import CTypeAhead from './components/forms/CTypeAhead.vue'
import CWysiwyg from './components/forms/CWysiwyg.vue'
import CYesOrNo from './components/forms/CYesOrNo.vue'

const components = {
  CAmount,
  CCheckbox,
  CConsent,
  CDatePicker,
  CDateRangePicker,
  CDropdown,
  CFile,
  CInput,
  CNumber,
  CTagInput,
  CTextarea,
  CTypeAhead,
  CWysiwyg,
  CYesOrNo
}

export const FormComponentsPlugin = {
  install(app, { prefix = '' } = {}) {
    Object.entries(components).forEach(([name, component]) => {
      const resolvedName = prefix ? `${prefix}${name}` : name
      app.component(resolvedName, component)
    })
  }
}

export const registerFormComponents = (app, options) => {
  FormComponentsPlugin.install(app, options)
}

export {
  CAmount,
  CCheckbox,
  CConsent,
  CDatePicker,
  CDateRangePicker,
  CDropdown,
  CFile,
  CInput,
  CNumber,
  CTagInput,
  CTextarea,
  CTypeAhead,
  CWysiwyg,
  CYesOrNo
}

export default components
