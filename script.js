/*****************************************
 * 定数
 *****************************************/
// マスの状態
SQUARE_STATUS_IS_OWNED = "01"; // 自分が所有している
SQUARE_STATUS_IS_OTHER = "02"; // 相手が所有している
SQUARE_STATUS_NOT_SELECTED = "09"; // 選択されていない

/*****************************************
 * 変数
 *****************************************/
// ターンを示す変数
let isOddTurn = true;

/*****************************************
 * イベント
 *****************************************/
$(function () {
  // マス目にイベントを設定する
  $(".square").click(clickSquareEvent);

  // 盤面を初期化する
  initializeEvent();
});

/**
 * マス目クリックイベント
 */
function clickSquareEvent() {
  // クリックされたマス目のオブジェクトを取得する
  let square = $(this);

  // クリックされたマス目が選択できない場合はスキップ
  if (!canSelect(square)) {
    return;
  }

  // マスの所有者を変更する
  changeOwner(square);
}

/**
 * 盤面初期化イベント
 */
function initializeEvent() {
  // 初期値設定
  changeOwner(getTargetSquare(3, 3));
  changeOwner(getTargetSquare(3, 4));
  changeOwner(getTargetSquare(4, 4));
  changeOwner(getTargetSquare(4, 3));
}

/*****************************************
 * 内部関数
 *****************************************/
/**
 * マス目の所有者を変更する
 */
function changeOwner(square) {
  // マス目にピースを置く
  putPiece(square, getTurnString());

  // 隣接するピースを反転する
  changeOwnerOpposite(square);

  // ターンを変更する
  changeTurn();
}

/**
 * マス目にピースを置く
 */
function putPiece(targetSquare, owner) {
  targetSquare.text("●").attr("data-owner", owner).addClass("selected");
}

/**
 * ターンを示す文字列を取得する
 */
function getTurnString() {
  if (isOddTurn) {
    return "black";
  }
  return "white";
}

/**
 * ターンを変更する
 */
function changeTurn() {
  // ターンを変更する
  isOddTurn = !isOddTurn;
}

/**
 * 指定位置のマス目オブジェクトを取得する
 */
function getTargetSquare(row, col) {
  return $("[data-row=" + row + "][data-col=" + col + "]");
}

/**
 * 指定されたマス目が選択できるか判定する
 */
function canSelect(square) {
  // 既にピースが設定されている場合は選択不可
  if (square.hasClass("selected")) {
    return false;
  }
  return true;
}

/**
 * 所有者を変更する
 */
function changeOwnerOpposite(square) {
  // クリックされたマス目の位置を取得する
  let row = square.data("row");
  let col = square.data("col");

  // 所有者を変更する
  changeOwnerOppositeLower(row, col); // 下
}

/**
 * 所有者を変更する(下)
 */
function changeOwnerOppositeLower(row, col) {
  // 対向先を取得する
  let endPos = getPosOppositeLower(row, col);
  if (endPos == null) {
    return;
  }

  // 対向先まで所有者を変更する
  let targetCol = col;
  for (targetRow = row + 1; targetRow < endPos.row; targetRow++) {
    let targetSquare = getTargetSquare(targetRow, targetCol);
    putPiece(targetSquare, getTurnString());
  }
}

/**
 * 対向の所有マスの位置を取得する(下)
 */
function getPosOppositeLower(row, col) {
  // 基準マスが最端の場合は対向先が存在しない
  if (row == 7) {
    return null;
  }

  // 隣接マスが相手所有ではない場合は対向先が存在しない
  let targetRow = row + 1;
  let targetCol = col;
  if (getSquareStatus(targetRow, targetCol) != SQUARE_STATUS_IS_OTHER) {
    return null;
  }

  // 対向先の有無を判定する
  for (targetRow++; targetRow <= 7; targetRow++) {
    // マスの状態を取得する
    let status = getSquareStatus(targetRow, targetCol);

    // 選択されていないマスに到達した場合は終了する
    if (status == SQUARE_STATUS_NOT_SELECTED) {
      return null;
    }

    // 自分の所有マスに到達した場合、位置を返却する
    if (status == SQUARE_STATUS_IS_OWNED) {
      return {
        row: targetRow,
        col: targetCol,
      };
    }
  }
  return null;
}

/**
 * 調査対象のマス目の状態を取得する
 */
function getSquareStatus(row, col) {
  // マスを取得する
  let targetSquare = getTargetSquare(row, col);

  // selectedクラスを持っていなければ未選択
  if (!targetSquare.hasClass("selected")) {
    return SQUARE_STATUS_NOT_SELECTED;
  }

  // 自分が所有している
  if (getTurnString() == targetSquare.attr("data-owner")) {
    return SQUARE_STATUS_IS_OWNED;
  }

  // 相手が所有している
  return SQUARE_STATUS_IS_OTHER;
}













