import{useTranslation} from "react-i18next"

const LanguageSelector = (props) => {

  const {i18n} =  useTranslation();
    return (
        <>
            <span className="btn btn-primary m-1" title={"español"} onClick={() => i18n.changeLanguage('es')}>ES</span>
            <span className="btn btn-primary m-1" title={"english"} onClick={() => i18n.changeLanguage('en')}>EN</span>
        </>
    )
}

export default LanguageSelector;
