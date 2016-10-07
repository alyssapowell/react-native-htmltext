/**
 * The examples provided by Facebook are for non-commercial testing and
 * evaluation purposes only.
 *
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @flow
 */
'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
  Image,
  ScrollView,
  ActivityIndicator,
  ListView,
  Platform,
  StyleSheet,
  Text,
  View,
  Dimensions,
} = ReactNative;

var width = Dimensions.get('window').width;

var dismissKeyboard = require('dismissKeyboard');

var SearchBar = require('SearchBar');

var HtmlText = require('./lib/HtmlText');

var TagCell = require('./TagCell');
var TagScreen = require('./TagScreen');

var getImageSource = require('./getImageSource');

var API_URL = 'http://api.dallasnews.com/v1/';


// Results should be cached keyed by the query
// with values of null meaning "being fetched"
// and anything besides null and undefined
// as the result of a valid query
var resultsCache = {
  dataForQuery: {},
  nextPageNumberForQuery: {},
  totalForQuery: {},
};

var LOADING = {};

class NewsScreen extends React.Component {


  render() {
    console.log("log this: story props", this.props.story);
    var categories = this.props.story._source.categories;
    //var TouchableElement = TouchableHighlight;
    var primaryCategory;
    var body = [];

    for (var i = 0; i < categories.length; i++) {
      //console.log("log this: category type", categories[i].categoryType, categories[i].category.name);
      if(categories[i].categoryType == "primary"){
        primaryCategory = categories[i];
      }
    };
    
    for(let i=0; i<this.props.story._source.content.data.body.length; i++){
      var bodySlice = this.props.story._source.content.data.body[i];
      if(bodySlice.chronicle_type == "image"){ //images
        if(this.props.story._source.content.data.defaultImage != bodySlice.images[0].filename){
          body.push(
             <SerifImage key={i} image={bodySlice} />
            );
        }
      };
      if(bodySlice.chronicle_type == "text"){ //text
        body.push(
          <SerifText key={i} content={bodySlice} />
        );
      }
      if(bodySlice.chronicle_type == "embed"){ //text
        /*body.push(
          <SerifText key = {i} content={bodySlice} />
        );*/
        //web view?
      }

    }

    return (
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View>
              <View style={styles.row}>
                
                  <Image
                    source={getImageSource(this.props.story, 'det')}
                    style={styles.cellImage}
                  >
                  <View style={styles.textContainer}>
                    
                      <View style={styles.tagContainer}>
                        <View style={styles.tag}>
                            <Text style={styles.tagInnards}>
                              {primaryCategory.category.name.toUpperCase()}
                            </Text>
                        </View>
                      </View>
                    <Text style={styles.storyTitle} numberOfLines={4}>
                      {this.props.story._source.content.data.heading}
                    </Text>
                  </View>
                  </Image>
              </View>
          </View>

        <View style={styles.mainSection}>
          {body}
        </View>
        
      </ScrollView>
    );
  }
}

class SerifText extends React.Component {
  render() {
    var content = this.props.content;

    return (
      <View style={styles.innerText}>
        <HtmlText style={styles.innerText} html={content.source}></HtmlText>
      </View>
    );
  }
}

class SerifImage extends React.Component {
  render() {
    var image = this.props.image;
    var uri = image.images[0].filename + '?auto=format,enhance&crop=faces,entropy&fit=crop&q=40&or=0&w=700&h=570';

    return (
      <View style={styles.innerImageView}>
        <Image
          source={{uri: uri}}
          style={styles.innerImage}
        />
        <HtmlText style={styles.innerImageCaption} html={image.images[0].caption}></HtmlText>        
      </View>
    );
  }
}

class Author extends React.Component {
  render() {

    return (
      <View>
        <HtmlText html={content.source}></HtmlText>
      </View>
    );
  }
}

class Social extends React.Component {
  render() {

    return (
      <View>
        
      </View>
    );
  }
}

var styles = StyleSheet.create({
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    position: 'absolute',
    bottom:20,
    left:0,
    height: undefined,
  },
  storyTitle: {
    fontSize: 24,
    left:0,
    fontWeight: '700',
    paddingTop:10,
    paddingLeft: 10,
    paddingRight:10,
    fontFamily:'AvenirNext-Heavy',
    color:'white',
    backgroundColor: 'transparent',
    textShadowColor: 'rgba(0,0,0, 0.7)',
    textShadowOffset: {'width':2,'height':2},
    textShadowRadius: 2,
    lineHeight: 26,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 5,
  },
  cellImage: {
    flex: 1,
    width: undefined,
    minHeight: 400,
    backgroundColor:'transparent',
  },
  cellBorder: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: StyleSheet.hairlineWidth,
    marginLeft: 4,
  },
  tagContainer:{
    flex: 1,
    flexDirection: 'row',
  },
  tag:{
    backgroundColor: '#329ce8',
    shadowColor: 'black',
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: 10,
    shadowOpacity: 0.5,
    shadowOffset: {'width':2,'height':2},
    shadowRadius: 2,
    transform: [{skewX: '-15deg'}],
  },
  tagInnards:{
    fontWeight: '700',
    fontSize: 10,
    lineHeight:25,
    letterSpacing: 2,
    textAlign: 'center',
    color: 'white',
    fontFamily:'AvenirNext-DemiBold',
    backgroundColor:'transparent',
    transform: [{skewX: '15deg'}],
  },
  mainSection:{
    
  },
  innerImageView:{
    paddingRight:20,
    paddingLeft:20,
  },
  innerImageCaption:{
    
    fontFamily: 'IowanOldStyle-Roman',
    padding:10,
    fontSize:10
  },
  innerImage:{
    minHeight: 200,
  },
  innerText:{
    width: width,
  }
});

module.exports = NewsScreen;
