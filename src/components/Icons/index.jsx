import {C001, C002, C003, C004, C005, C006, C007, C008, C009, C010} from "./C001-C010";
import {C011, C012, C013, C014, C015, C016, C017, C018, C019, C020} from "./C011-C020";

const CategoryIcon = props => {
  switch (props.name.toLowerCase()) {
    case 'c001':
      return <C001 {...props} />
    case 'c002':
      return <C002 {...props} />
    case 'c003':
      return <C003 {...props} />
    case 'c004':
      return <C004 {...props} />
    case 'c005':
      return <C005 {...props} />
    case 'c006':
      return <C006 {...props} />
    case 'c007':
      return <C007 {...props} />
    case 'c008':
      return <C008 {...props} />
    case 'c009':
      return <C009 {...props} />
    case 'c010':
      return <C010 {...props} />
    case 'c011':
      return <C011 {...props} />
    case 'c012':
      return <C012 {...props} />
    case 'c013':
      return <C013 {...props} />
    case 'c014':
      return <C014 {...props} />
    case 'c015':
      return <C015 {...props} />
    case 'c016':
      return <C016 {...props} />
    case 'c017':
      return <C017 {...props} />
  
    default:
      return <div/>
  }
}

export default CategoryIcon